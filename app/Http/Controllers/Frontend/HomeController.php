<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Support\CustomerPortal;
use App\Support\PortalGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user(PortalGuard::CUSTOMER);

        if ($user?->isDiamond()) {
            return redirect()->to(CustomerPortal::defaultLandingUrl($user));
        }

        return Inertia::render('Frontend/Home/Index');
    }
}
