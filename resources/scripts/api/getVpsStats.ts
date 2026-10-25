import http from '@/api/http';

export interface VpsHostStats {
    nodes: number;
    memory_bytes: number;
    memory_allocated_bytes: number;
    cpu_cores: number;
    disk_bytes: number;
    disk_allocated_bytes: number;
    uptime: number;
    online_nodes: number;
}

export default (): Promise<VpsHostStats> =>
    http.get('/api/client/vps').then(({ data }) => data);