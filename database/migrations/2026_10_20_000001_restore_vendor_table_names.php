<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Restore vendor table/column names after a partial rename left the DB
     * on customers/customer_id while the application still uses Vendor models.
     */
    public function up(): void
    {
        if (Schema::hasTable('customers') && ! Schema::hasTable('vendors')) {
            Schema::rename('customers', 'vendors');
        }

        if (Schema::hasTable('customer_applications') && ! Schema::hasTable('vendor_applications')) {
            Schema::rename('customer_applications', 'vendor_applications');
        }

        if (Schema::hasColumn('products', 'customer_id') && ! Schema::hasColumn('products', 'vendor_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropForeign(['customer_id']);
            });

            Schema::table('products', function (Blueprint $table) {
                $table->renameColumn('customer_id', 'vendor_id');
            });

            Schema::table('products', function (Blueprint $table) {
                $table->foreign('vendor_id')->references('id')->on('vendors')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('products', 'vendor_id') && ! Schema::hasColumn('products', 'customer_id')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropForeign(['vendor_id']);
            });

            Schema::table('products', function (Blueprint $table) {
                $table->renameColumn('vendor_id', 'customer_id');
            });

            Schema::table('products', function (Blueprint $table) {
                $table->foreign('customer_id')->references('id')->on('customers')->nullOnDelete();
            });
        }

        if (Schema::hasTable('vendor_applications') && ! Schema::hasTable('customer_applications')) {
            Schema::rename('vendor_applications', 'customer_applications');
        }

        if (Schema::hasTable('vendors') && ! Schema::hasTable('customers')) {
            Schema::rename('vendors', 'customers');
        }
    }
};
