// ==========================================
// CONFIGURATION SUPABASE
// ==========================================

const SUPABASE_CONFIG = {
    url: "https://belekcdvgslnnejqonjb.supabase.co",
    anonKey: "sb_publishable_tb_mhTjs26f4hMQD0Y4SSQ_8JnF2dqp"
};

// Initialisation du client
const supabaseClient = supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
);

// Rendre disponible globalement
window.supabaseClient = supabaseClient;

console.log('✅ Supabase configuré avec succès !');
