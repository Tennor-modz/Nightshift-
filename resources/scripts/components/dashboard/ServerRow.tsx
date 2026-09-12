import React, { useEffect, useRef, useState } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faCalendarAlt,
    faClock,
    faHdd,
    faMemory,
    faServer,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, mbToBytes } from '@/lib/formatters';
import GreyRowBox from '@/components/elements/GreyRowBox';
import styled from 'styled-components/macro';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

type CardStatus = ServerPowerState | 'loading';

const StatusIndicatorBox = styled(GreyRowBox)<{ $status: CardStatus }>`
    position: relative;
    display: block;
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid
        ${({ $status }) =>
            $status === 'running'
                ? 'rgba(34, 197, 94, 0.38)'
                : $status === 'offline'
                ? 'rgba(239, 68, 68, 0.38)'
                : 'rgba(245, 158, 11, 0.3)'};
    background: ${({ $status }) =>
        $status === 'running'
            ? 'linear-gradient(145deg, rgba(20, 83, 45, 0.22), rgba(17, 24, 32, 0.94))'
            : $status === 'offline'
            ? 'linear-gradient(145deg, rgba(127, 29, 29, 0.18), rgba(17, 24, 32, 0.94))'
            : 'rgba(17, 24, 32, 0.94)'};
    box-shadow: 0 16px 38px rgba(0, 0, 0, 0.16);
    transition: transform 150ms ease, border-color 150ms ease;

    &:hover {
        transform: translateY(-2px);
        border-color: ${({ $status }) =>
            $status === 'running'
                ? 'rgba(34, 197, 94, 0.7)'
                : $status === 'offline'
                ? 'rgba(239, 68, 68, 0.7)'
                : 'rgba(245, 158, 11, 0.65)'};
    }
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended || server.isNodeUnderMaintenance) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended, server.isNodeUnderMaintenance]);

    const alarms = { memory: false, disk: false };
    if (stats) {
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimitInBytes = server.limits.disk !== 0 ? mbToBytes(server.limits.disk) : 0;
    const diskLimit = diskLimitInBytes > 0 ? bytesToString(diskLimitInBytes) : 'Unlimited';
    const diskRemaining =
        diskLimitInBytes > 0 && stats
            ? bytesToString(Math.max(diskLimitInBytes - stats.diskUsageInBytes, 0))
            : diskLimitInBytes > 0
            ? '—'
            : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const coreLimit = server.limits.cpu !== 0 ? `${Math.max(server.limits.cpu / 100, 0.01)} cores` : 'Unlimited';
    const cpuUsage = stats ? `${stats.cpuUsagePercent.toFixed(1)}%` : '—';
    const status: CardStatus = stats?.status || (server.status === 'suspended' ? 'offline' : 'loading');
    const statusLabel =
        server.isNodeUnderMaintenance
            ? 'Maintenance'
            : status === 'loading'
            ? 'Checking'
            : status.charAt(0).toUpperCase() + status.slice(1);
    const uptime = stats
        ? stats.status === 'running'
            ? formatUptime(stats.uptime)
            : stats.status === 'offline'
            ? 'Offline'
            : '—'
        : status === 'offline'
        ? 'Offline'
        : '—';
    const createdAt = Number.isNaN(server.createdAt.getTime()) ? 'Unknown' : formatDate(server.createdAt);

    return (
        <StatusIndicatorBox className={className} $status={status}>
            <div className='nightshift-server-card-header'>
                <div className='nightshift-server-card-identity'>
                    <span className='nightshift-server-card-icon'>
                        <FontAwesomeIcon icon={faServer} />
                    </span>
                    <div className='min-w-0'>
                        <p className='nightshift-server-card-name'>{server.name}</p>
                        <p className='nightshift-server-card-node'>{server.node || 'Server node'}</p>
                    </div>
                </div>
                <div className='nightshift-server-card-actions'>
                    <span
                        className={`nightshift-server-status ${
                            status === 'running'
                                ? 'nightshift-server-status-running'
                                : status === 'offline'
                                ? 'nightshift-server-status-offline'
                                : 'nightshift-server-status-pending'
                        }`}
                    >
                        <span className='nightshift-server-status-dot' />
                        {statusLabel}
                    </span>
                    <Link
                        to={`/server/${server.id}`}
                        className='nightshift-server-open'
                        aria-label={`Open ${server.name}`}
                        title={`Open ${server.name}`}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>
            </div>
            {!!server.description && <p className='nightshift-server-card-description'>{server.description}</p>}
            <div className='nightshift-server-card-stats'>
                <ServerMetric icon={faClock} label='Uptime' value={uptime} />
                <ServerMetric
                    icon={faMemory}
                    label='RAM'
                    value={stats ? `${bytesToString(stats.memoryUsageInBytes)} / ${memoryLimit}` : '—'}
                    alarm={alarms.memory}
                />
                <ServerMetric
                    icon={faHdd}
                    label='Disk'
                    value={stats ? `${bytesToString(stats.diskUsageInBytes)} used / ${diskRemaining} free` : '—'}
                    alarm={alarms.disk}
                />
                <ServerMetric icon={faServer} label='Cores' value={`${coreLimit} · ${cpuUsage} usage`} />
                <ServerMetric icon={faCalendarAlt} label='Created' value={createdAt} />
            </div>
        </StatusIndicatorBox>
    );
};

const ServerMetric = ({
    icon,
    label,
    value,
    alarm = false,
}: {
    icon: IconDefinition;
    label: string;
    value: string;
    alarm?: boolean;
}) => (
    <div className={`nightshift-server-metric${alarm ? ' nightshift-server-metric-alarm' : ''}`}>
        <FontAwesomeIcon icon={icon} />
        <div>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    </div>
);

const formatUptime = (milliseconds: number): string => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

const formatDate = (date: Date): string =>
    date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
