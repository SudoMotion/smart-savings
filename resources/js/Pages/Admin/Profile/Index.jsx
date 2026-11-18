import AdminPageHeader from '@/Components/Admin/AdminPageHeader';
import { AdminForm, AdminFormGrid } from '@/Components/Admin/AdminForm';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Alert, Button, Card, Input } from '@/Components/UI';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ profile }) {
    const { flash } = usePage().props;
    const [photoPreview, setPhotoPreview] = useState(profile.profile_photo_url ?? null);

    const {
        data: profileData,
        setData: setProfileData,
        post: submitProfile,
        processing: profileProcessing,
        errors: profileErrors,
    } = useForm({
        name: profile.name ?? '',
        email: profile.email ?? '',
        profile_photo: null,
        remove_profile_photo: false,
        _method: 'patch',
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        put: submitPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPasswordForm,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setPhotoPreview(profile.profile_photo_url ?? null);
    }, [profile.profile_photo_url]);

    useEffect(() => {
        if (!profileData.profile_photo) {
            return undefined;
        }

        const url = URL.createObjectURL(profileData.profile_photo);
        setPhotoPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [profileData.profile_photo]);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        setProfileData('profile_photo', file);
        if (file) {
            setProfileData('remove_profile_photo', false);
        }
    };

    const removePhoto = () => {
        setProfileData('profile_photo', null);
        setProfileData('remove_profile_photo', true);
        setPhotoPreview(null);
    };

    const saveProfile = (e) => {
        e.preventDefault();
        submitProfile(route('admin.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setProfileData('profile_photo', null);
                setProfileData('remove_profile_photo', false);
            },
        });
    };

    const savePassword = (e) => {
        e.preventDefault();
        submitPassword(route('admin.profile.password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPasswordForm(),
        });
    };

    return (
        <AdminLayout title="My Profile">
            <Head title="My Profile" />

            <AdminPageHeader
                title="My Profile"
                description="Update your account details, profile photo, and password."
            />

            {flash?.success && (
                <Alert variant="success" className="mb-4">
                    {flash.success}
                </Alert>
            )}

            <div className="space-y-6">
                <AdminForm onSubmit={saveProfile}>
                    <Card title="Account">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-semibold text-neutral-500">
                                        {(profileData.name || '?').charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <label className="inline-flex cursor-pointer">
                                    <input
                                        type="file"
                                        className="sr-only"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        onChange={handlePhotoChange}
                                    />
                                    <span className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50">
                                        {photoPreview ? 'Change photo' : 'Upload photo'}
                                    </span>
                                </label>
                                {(photoPreview || profile.profile_photo_url) && (
                                    <Button type="button" variant="secondary" size="sm" onClick={removePhoto}>
                                        Remove
                                    </Button>
                                )}
                            </div>
                            {profileErrors.profile_photo && (
                                <p className="text-xs text-rose-600 sm:basis-full">
                                    {profileErrors.profile_photo}
                                </p>
                            )}
                        </div>

                        <AdminFormGrid>
                            <Input
                                id="name"
                                label="Name"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                                value={profileData.name}
                                error={profileErrors.name}
                                required
                                autoComplete="name"
                                onChange={(e) => setProfileData('name', e.target.value)}
                            />
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                wrapperClassName="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                                value={profileData.email}
                                error={profileErrors.email}
                                required
                                autoComplete="username"
                                onChange={(e) => setProfileData('email', e.target.value)}
                            />
                        </AdminFormGrid>

                        <div className="mt-4 flex justify-end">
                            <Button type="submit" disabled={profileProcessing}>
                                Save profile
                            </Button>
                        </div>
                    </Card>
                </AdminForm>

                <AdminForm onSubmit={savePassword}>
                    <Card title="Password">
                        <AdminFormGrid>
                            <Input
                                id="current_password"
                                label="Current password"
                                type="password"
                                value={passwordData.current_password}
                                error={passwordErrors.current_password}
                                required
                                autoComplete="current-password"
                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                            />
                            <Input
                                id="password"
                                label="New password"
                                type="password"
                                value={passwordData.password}
                                error={passwordErrors.password}
                                required
                                autoComplete="new-password"
                                onChange={(e) => setPasswordData('password', e.target.value)}
                            />
                            <Input
                                id="password_confirmation"
                                label="Confirm new password"
                                type="password"
                                value={passwordData.password_confirmation}
                                error={passwordErrors.password_confirmation}
                                required
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setPasswordData('password_confirmation', e.target.value)
                                }
                            />
                        </AdminFormGrid>

                        <div className="mt-4 flex justify-end">
                            <Button type="submit" disabled={passwordProcessing}>
                                Update password
                            </Button>
                        </div>
                    </Card>
                </AdminForm>
            </div>
        </AdminLayout>
    );
}