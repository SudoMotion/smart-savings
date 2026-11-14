<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')
            ->where('user_type', 'inactive_member')
            ->update(['user_type' => 'gold_member']);
    }

    public function down(): void
    {
        // Inactive member was removed and is not restored.
    }
};
