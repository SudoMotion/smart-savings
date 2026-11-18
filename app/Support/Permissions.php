<?php

namespace App\Support;

class Permissions
{
    public const SUPERADMIN_ROLE = 'superadmin';

    /**
     * @return array<string, array<string, string>>
     */
    public static function groups(): array
    {
        return [
            'Dashboard' => [
                'dashboard.view' => 'View Dashboard',
            ],
            'Users' => [
                'users.view' => 'View Users',
                'users.create' => 'Create Users',
                'users.edit' => 'Edit Users',
                'users.delete' => 'Delete Users',
            ],
            'About Us' => [
                'about-us.view' => 'View About Us',
                'about-us.update' => 'Update About Us',
            ],
            'Deposit Options' => [
                'deposit-options.view' => 'View Deposit Options',
                'deposit-options.create' => 'Create Deposit Options',
                'deposit-options.edit' => 'Edit Deposit Options',
                'deposit-options.delete' => 'Delete Deposit Options',
            ],
            'Deposit Requests' => [
                'deposit-requests.view' => 'View Deposit Requests',
                'deposit-requests.review' => 'Approve or Reject Deposit Requests',
            ],
            'Withdraw Requests' => [
                'withdraw-requests.view' => 'View Withdraw Requests',
                'withdraw-requests.review' => 'Approve or Reject Withdraw Requests',
            ],
            'Order Limits' => [
                'order-limits.view' => 'View Order Limits',
                'order-limits.update' => 'Update Global Order Limit',
                'order-limits.create' => 'Create User Order Limits',
                'order-limits.edit' => 'Edit User Order Limits',
                'order-limits.delete' => 'Delete User Order Limits',
            ],
            'Referral Rewards' => [
                'referral-tiers.view' => 'View Referral Reward Tiers',
                'referral-tiers.create' => 'Create Referral Reward Tiers',
                'referral-tiers.edit' => 'Edit Referral Reward Tiers',
                'referral-tiers.delete' => 'Delete Referral Reward Tiers',
            ],
            'Brands' => [
                'brands.view' => 'View Brands',
                'brands.create' => 'Create Brands',
                'brands.edit' => 'Edit Brands',
                'brands.delete' => 'Delete Brands',
            ],
            'Categories' => [
                'categories.view' => 'View Categories',
                'categories.create' => 'Create Categories',
                'categories.edit' => 'Edit Categories',
                'categories.delete' => 'Delete Categories',
            ],
            'Subcategories' => [
                'subcategories.view' => 'View Subcategories',
                'subcategories.create' => 'Create Subcategories',
                'subcategories.edit' => 'Edit Subcategories',
                'subcategories.delete' => 'Delete Subcategories',
            ],
            'Subsubcategories' => [
                'subsubcategories.view' => 'View Subsubcategories',
                'subsubcategories.create' => 'Create Subsubcategories',
                'subsubcategories.edit' => 'Edit Subsubcategories',
                'subsubcategories.delete' => 'Delete Subsubcategories',
            ],
            'Units' => [
                'units.view' => 'View Units',
                'units.create' => 'Create Units',
                'units.edit' => 'Edit Units',
                'units.delete' => 'Delete Units',
            ],
            'Attributes' => [
                'attributes.view' => 'View Attributes',
                'attributes.create' => 'Create Attributes',
                'attributes.edit' => 'Edit Attributes',
                'attributes.delete' => 'Delete Attributes',
            ],
            'Products' => [
                'products.view' => 'View Products',
                'products.create' => 'Create Products',
                'products.edit' => 'Edit Products',
                'products.delete' => 'Delete Products',
            ],
            'Settings' => [
                'settings.view' => 'View Settings',
                'settings.update' => 'Update Settings',
            ],
            'Roles' => [
                'roles.view' => 'View Roles',
                'roles.create' => 'Create Roles',
                'roles.edit' => 'Edit Roles',
                'roles.delete' => 'Delete Roles',
            ],
            'Permissions' => [
                'permissions.view' => 'View Permissions',
                'permissions.update' => 'Update Permissions',
            ],
            'Staff Users' => [
                'staff-users.view' => 'View Staff Users',
                'staff-users.create' => 'Create Staff Users',
                'staff-users.edit' => 'Edit Staff Users',
                'staff-users.delete' => 'Delete Staff Users',
            ],
            'Vendor Catalog' => [
                'vendor-applications.view' => 'View Vendor Applications',
                'vendor-applications.approve' => 'Approve Vendor Applications',
                'vendor-applications.reject' => 'Reject Vendor Applications',
                'vendor-applications.delete' => 'Delete Vendor Applications',
                'vendors.view' => 'View Vendors',
                'vendors.edit' => 'Edit Vendors',
                'vendors.delete' => 'Delete Vendors',
                'vendor-permissions.manage' => 'Manage Vendor Permissions',
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function all(): array
    {
        $permissions = [];

        foreach (self::groups() as $groupPermissions) {
            foreach ($groupPermissions as $name => $label) {
                $permissions[] = $name;
            }
        }

        return $permissions;
    }
}
