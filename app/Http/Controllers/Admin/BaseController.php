<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\View\View;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Models\Server;
use Pterodactyl\Models\User;
use Pterodactyl\Services\Helpers\SoftwareVersionService;

class BaseController extends Controller
{
    /**
     * BaseController constructor.
     */
    public function __construct(private SoftwareVersionService $version)
    {
    }

    /**
     * Return the admin index view.
     */
    public function index(): View
    {
        return view('admin.index', [
            'version' => $this->version,
            'stats' => [
                'servers' => Server::query()->count(),
                'users' => User::query()->count(),
                'admins' => User::query()->where('root_admin', true)->count(),
            ],
        ]);
    }
}
