import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faClock, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerStats } from '@/api/server/getServerResourceUsage';
import getVpsStats, { VpsHostStats } from '@/api/getVpsStats';
import { bytesToString, mbToBytes } from '@/lib/formatters';

interface Props {
    servers: Server[];
    showHostStats: boolean;
}

interface MetricProps {
    icon: IconDefinition;
    label: string;
    value: string;
    detail?: string;
}

export default ({ servers, showHostStats }: Props) => {
    const [serverStats, setServerStats] = useState<Record<string, ServerStats>>({});
    const { data: hostStats } = useSWR<VpsHostStats>(showHostStats ? '/api/client/vps' : null, getVpsStats);

    useEffect(() => {
        let cancelled = false;

        Promise.all(
            servers.map(async (server) => {
                try {
                    return [server.uuid, await getServerResourceUsage(server.uuid)] as const;
                } catch {
                    return null;
                }
            })
        ).then((results) => {
            if (cancelled) return;

            setServerStats(
                results.reduce<Record<string, ServerStats>>((stats, result) => {
                    if (result) stats[result[0]] = result[1];
                    return stats;
                }, {})
            );
        });

        return () => {
            cancelled = true;
        };
    }, [servers]);

    const memoryAllocated = servers.reduce(
        (total, server) => total + (server.limits.memory ? mbToBytes(server.limits.memory) : 0),
        0
    );
    const memoryUsed = Object.values(serverStats).reduce((total, stats) => total + stats.memoryUsageInBytes, 0);
    const diskIsUnlimited = servers.some((server) => server.limits.disk === 0);
    const diskAllocated = servers.reduce(
        (total, server) => total + (server.limits.disk ? mbToBytes(server.limits.disk) : 0),
        0
    );
    const diskUsed = Object.values(serverStats).reduce((total, stats) => total + stats.diskUsageInBytes, 0);
    const cpuIsUnlimited = servers.some((server) => server.limits.cpu === 0);
    const cpuCores = servers.reduce((total, server) => total + server.limits.cpu, 0) / 100;
    const uptime = Math.max(
        0,
        ...Object.values(serverStats)
            .filter((stats) => stats.status === 'running')
            .map((stats) => stats.uptime)
    );

    return (
        <section className='nightshift-vps-overview'>
            <div className='nightshift-vps-overview-header'>
                <div>
                    <p className='nightshift-dashboard-kicker'>VPS / Resources</p>
                    <h2 className='nightshift-vps-overview-title'>VPS overview</h2>
                    <p className='nightshift-vps-overview-copy'>
                        Live totals for the servers shown below.
                    </p>
                </div>
                <span className='nightshift-vps-overview-badge'>
                    {showHostStats ? 'User + host view' : 'Live allocation'}
                </span>
            </div>
            <div className='nightshift-vps-metrics'>
                <VpsMetric
                    icon={faMemory}
                    label='VPS RAM'
                    value={`${bytesToString(memoryUsed)} / ${memoryAllocated ? bytesToString(memoryAllocated) : 'Unlimited'}`}
                    detail='Used / allocated'
                />
                <VpsMetric
                    icon={faMicrochip}
                    label='Core'
                    value={cpuIsUnlimited ? 'Unlimited' : `${cpuCores.toFixed(1)} vCPU`}
                    detail='Visible server allocation'
                />
                <VpsMetric
                    icon={faHdd}
                    label='Disk'
                    value={diskIsUnlimited ? 'Unlimited' : bytesToString(diskAllocated)}
                    detail='Allocated capacity'
                />
                <VpsMetric icon={faHdd} label='Space used' value={bytesToString(diskUsed)} detail='Live server usage' />
                <VpsMetric
                    icon={faHdd}
                    label='Space remaining'
                    value={diskIsUnlimited ? 'Unlimited' : bytesToString(Math.max(diskAllocated - diskUsed, 0))}
                    detail='Allocated minus used'
                />
                <VpsMetric
                    icon={faClock}
                    label='VPS uptime'
                    value={uptime ? formatUptime(uptime) : '—'}
                    detail='Longest running server'
                />
            </div>
            {showHostStats && (
                <div className='nightshift-vps-host'>
                    <div className='nightshift-vps-host-heading'>
                        <div>
                            <p className='nightshift-vps-host-kicker'>Root admin</p>
                            <h3>Host capacity</h3>
                        </div>
                        <span>
                            <FontAwesomeIcon icon={faServer} /> {hostStats?.online_nodes || 0}/{hostStats?.nodes || 0} nodes online
                        </span>
                    </div>
                    <div className='nightshift-vps-host-metrics'>
                        <VpsMetric
                            icon={faMemory}
                            label='Host RAM'
                            value={hostStats?.memory_bytes ? bytesToString(hostStats.memory_bytes) : 'Unavailable'}
                            detail={hostStats ? `${bytesToString(hostStats.memory_allocated_bytes)} allocated` : undefined}
                        />
                        <VpsMetric
                            icon={faMicrochip}
                            label='Host cores'
                            value={hostStats?.cpu_cores ? `${hostStats.cpu_cores} cores` : 'Unavailable'}
                            detail='Across online nodes'
                        />
                        <VpsMetric
                            icon={faHdd}
                            label='Host disk'
                            value={hostStats?.disk_bytes ? bytesToString(hostStats.disk_bytes) : 'Unavailable'}
                            detail={hostStats ? `${bytesToString(hostStats.disk_allocated_bytes)} allocated` : undefined}
                        />
                        <VpsMetric
                            icon={faClock}
                            label='Host uptime'
                            value={hostStats?.uptime ? formatUptime(hostStats.uptime) : 'Unavailable'}
                            detail='Reported by Wings'
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

const VpsMetric = ({ icon, label, value, detail }: MetricProps) => (
    <div className='nightshift-vps-metric'>
        <span className='nightshift-vps-metric-icon'>
            <FontAwesomeIcon icon={icon} />
        </span>
        <div>
            <span className='nightshift-vps-metric-label'>{label}</span>
            <strong>{value}</strong>
            {detail && <small>{detail}</small>}
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