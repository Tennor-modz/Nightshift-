<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Pterodactyl\Models\Node;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Repositories\Wings\DaemonConfigurationRepository;

class VpsController extends Controller
{
    public function __construct(private DaemonConfigurationRepository $repository)
    {
    }

    /**
     * Return host capacity information for root administrators.
     *
     * The client dashboard can safely show this endpoint only to root admins because
     * it contains node capacity and daemon information that regular users should not see.
     */
    public function __invoke(Request $request): array
    {
        abort_unless($request->user()?->root_admin, 403);

        $nodes = Node::query()
            ->with(['servers:id,node_id,memory,disk'])
            ->get()
            ->map(function (Node $node): array {
                $system = [];

                try {
                    $system = $this->repository->setNode($node)->getSystemInformation(2);
                } catch (\Throwable) {
                    // Capacity from the panel database remains useful if Wings is unavailable.
                }

                $allocatedMemory = (int) $node->servers->sum('memory') * 1024 * 1024;
                $allocatedDisk = (int) $node->servers->sum('disk') * 1024 * 1024;
                $diskCapacity = (int) $node->disk * 1024 * 1024;
                $memoryCapacity = (int) Arr::get($system, 'system.memory_bytes', 0);

                return [
                    'name' => $node->name,
                    'memory_bytes' => $memoryCapacity,
                    'memory_allocated_bytes' => $allocatedMemory,
                    'cpu_cores' => (int) Arr::get($system, 'cpu_count', Arr::get($system, 'system.cpu_count', 0)),
                    'disk_bytes' => $diskCapacity,
                    'disk_allocated_bytes' => $allocatedDisk,
                    'uptime' => (int) Arr::get($system, 'uptime', Arr::get($system, 'system.uptime', 0)),
                    'online' => !empty($system),
                ];
            })
            ->values();

        return [
            'nodes' => $nodes->count(),
            'memory_bytes' => $nodes->sum('memory_bytes'),
            'memory_allocated_bytes' => $nodes->sum('memory_allocated_bytes'),
            'cpu_cores' => $nodes->sum('cpu_cores'),
            'disk_bytes' => $nodes->sum('disk_bytes'),
            'disk_allocated_bytes' => $nodes->sum('disk_allocated_bytes'),
            'uptime' => $nodes->max('uptime'),
            'online_nodes' => $nodes->where('online', true)->count(),
            'node_details' => $nodes,
        ];
    }
}