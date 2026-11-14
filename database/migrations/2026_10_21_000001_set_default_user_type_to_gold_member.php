<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE users MODIFY user_type VARCHAR(32) NOT NULL DEFAULT 'gold_member'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY user_type VARCHAR(32) NOT NULL DEFAULT 'inactive_member'");
    }
};
