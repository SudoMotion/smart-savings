<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAdminPasswordRequest;
use App\Http\Requests\Admin\UpdateAdminProfileRequest;
use App\Support\PortalGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user(PortalGuard::ADMIN);
        abort_unless($user?->canAccessAdminPanel(), 403);

        return Inertia::render('Admin/Profile/Index', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo_url' => $user->profile_photo_url,
            ],
        ]);
    }

    public function update(UpdateAdminProfileRequest $request): RedirectResponse
    {
        $user = $request->user(PortalGuard::ADMIN);

        $user->fill($request->safe()->only(['name', 'email']));

        if ($request->boolean('remove_profile_photo')) {
            $this->deleteProfilePhoto($user);
            $user->profile_photo_path = null;
        }

        if ($request->hasFile('profile_photo')) {
            $this->deleteProfilePhoto($user);
            $user->profile_photo_path = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(UpdateAdminPasswordRequest $request): RedirectResponse
    {
        $user = $request->user(PortalGuard::ADMIN);

        $user->update([
            'password' => Hash::make($request->validated('password')),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    private function deleteProfilePhoto(\App\Models\User $user): void
    {
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }
    }
}