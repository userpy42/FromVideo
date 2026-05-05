// Gestione Stato Utente
const FromVideo = {
    register: (user) => {
        localStorage.setItem('fv_user', user);
        localStorage.setItem('fv_sub', 'false');
        window.location.href = 'giftcard.html';
    },
    login: (user) => {
        localStorage.setItem('fv_user', user);
        window.location.href = 'dashboard.html';
    },
    activateSub: (plan) => {
        localStorage.setItem('fv_sub', 'true');
        localStorage.setItem('fv_plan', plan);
        alert("Piano " + plan + " attivato!");
        window.location.href = 'dashboard.html';
    },
    checkAccess: () => {
        const sub = localStorage.getItem('fv_sub');
        const overlays = document.querySelectorAll('.locked-overlay');
        if(sub === 'true') {
            overlays.forEach(o => o.style.display = 'none');
        }
    }
};

// Funzione per mostrare gli episodi (6 per ogni serie)
function openEpisodes(name) {
    const isSub = localStorage.getItem('fv_sub');
    if(isSub !== 'true') {
        alert("Attiva un abbonamento per vedere gli episodi di " + name);
        return;
    }
    let lista = "";
    for(let i=1; i<=6; i++) {
        lista += "- Episodio " + i + " (Pronto alla visione)\n";
    }
    alert("Stai guardando: " + name + "\n\n" + lista);
}
