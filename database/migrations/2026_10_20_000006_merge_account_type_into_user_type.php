<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')->update([
            'user_type' => DB::raw("COALESCE(NULLIF(account_type, ''), 'inactive_member')"),
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('account_type');
        });

        DB::statement("ALTER TABLE users MODIFY user_type VARCHAR(32) NOT NULL DEFAULT 'inactive_member'");
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('account_type', 32)
                ->default('inactive_member')
                ->after('percentage');
        });

        DB::table('users')->update([
            'account_type' => DB::raw('user_type'),
        ]);

        DB::statement("ALTER TABLE users MODIFY user_type VARCHAR(32) NOT NULL DEFAULT 'inactive_member'");
    }
};
