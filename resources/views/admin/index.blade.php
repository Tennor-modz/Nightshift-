@extends('layouts.admin')

@section('title')
    Administration
@endsection

@section('content-header')
    <h1>Administrative Overview<small>A quick glance at your system.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Index</li>
    </ol>
@endsection

@section('content')
<div class="row nightshift-admin-intro">
    <div class="col-xs-12">
        <div class="box nightshift-admin-system-box">
            <div class="box-header with-border">
                <span class="nightshift-admin-eyebrow">Nightshift / Control room</span>
                <h3 class="box-title">System Information</h3>
            </div>
            <div class="box-body nightshift-admin-system-copy">
                @if ($version->isLatestPanel())
                    <span class="nightshift-admin-status"><i class="fa fa-check-circle"></i> System nominal</span>
                    You are running Nightshift <code>{{ config('app.fork-version') }}</code> based on Pterodactyl Panel version <code>{{ config('app.version') }}</code>. Your panel is up-to-date!
                @else
                    <span class="nightshift-admin-status nightshift-admin-status-warning"><i class="fa fa-exclamation-triangle"></i> Update available</span>
                    Your panel is <strong>not up-to-date!</strong> The latest version is <a href="https://github.com/Pterodactyl/Panel/releases/v{{ $version->getPanel() }}" target="_blank"><code>{{ $version->getPanel() }}</code></a> and you are currently running version <code>{{ config('app.version') }}</code>. Nightshift is pinned to Pterodactyl Panel 1.15.1.
                @endif
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-xs-12">
        <div class="box nightshift-admin-stats-card">
            <div class="box-header with-border">
                <span class="nightshift-admin-eyebrow">Live overview</span>
                <h3 class="box-title">Panel statistics</h3>
            </div>
            <div class="box-body">
                <div class="nightshift-admin-stats-grid">
                    <div class="nightshift-admin-stat">
                        <span class="nightshift-admin-stat-icon"><i class="fa fa-server"></i></span>
                        <span class="nightshift-admin-stat-value">{{ number_format($stats['servers']) }}</span>
                        <span class="nightshift-admin-stat-label">Servers</span>
                    </div>
                    <div class="nightshift-admin-stat">
                        <span class="nightshift-admin-stat-icon"><i class="fa fa-users"></i></span>
                        <span class="nightshift-admin-stat-value">{{ number_format($stats['users']) }}</span>
                        <span class="nightshift-admin-stat-label">Users</span>
                    </div>
                    <div class="nightshift-admin-stat">
                        <span class="nightshift-admin-stat-icon"><i class="fa fa-shield"></i></span>
                        <span class="nightshift-admin-stat-value">{{ number_format($stats['admins']) }}</span>
                        <span class="nightshift-admin-stat-label">Admin users</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row nightshift-admin-actions">
    <div class="col-xs-6 col-sm-4">
        <a class="btn nightshift-admin-action nightshift-admin-action-amber" href="https://github.com/pterodactyl/panel/issues" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-fw fa-github"></i> Get Help <small>(via GitHub)</small>
        </a>
    </div>
    <div class="col-xs-6 col-sm-4">
        <a class="btn nightshift-admin-action nightshift-admin-action-neutral" href="https://pterodactyl.io" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-fw fa-link"></i> Documentation
        </a>
    </div>
    <div class="col-xs-6 col-sm-4">
        <a class="btn nightshift-admin-action nightshift-admin-action-neutral" href="https://github.com/pterodactyl/panel" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-fw fa-github"></i> GitHub
        </a>
    </div>
    <div class="col-xs-6 col-sm-4">
        <a class="btn nightshift-admin-action nightshift-admin-action-green" href="{{ $version->getDonations() }}" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-fw fa-money"></i> Support the Project
        </a>
    </div>
    <div class="col-xs-6 col-sm-4">
        <a class="btn nightshift-admin-action nightshift-admin-action-whatsapp" href="https://wa.me/254703726139" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-fw fa-whatsapp"></i> Chat Owner
        </a>
    </div>
    <div class="col-xs-6 col-sm-4">
        <a class="btn nightshift-admin-action nightshift-admin-action-coffee" href="https://wa.me/254703726139" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-fw fa-coffee"></i> Buy Coffee <span aria-hidden="true">☕</span>
        </a>
    </div>
</div>
@endsection
