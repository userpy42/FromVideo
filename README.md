# 🎬 FromVideo — Piattaforma di Streaming Digitale

> **Tesina Tecnica · Anno Scolastico 2025/2026**  
> **Alunno:** Kristian Lefter · **Classe:** 4I
> AFMG (Accademia Formativa Martesana di Gorgonzola)

---

## 📌 Descrizione del Progetto

**FromVideo** è un sito web che simula una piattaforma di streaming video, realizzato come tesina tecnica per l'anno scolastico 2025/2026. Il progetto dimostra competenze di sviluppo web front-end, design dell'interfaccia utente e logica di funzionamento di un servizio digitale moderno.

---

## 🚀 Demo Live

🔗 [fromvideo.netlify.app](https://fromvideo.netlify.app) _(deploy tramite Netlify)_

---

## ✨ Funzionalità Implementate

| Funzionalità | Descrizione |
|---|---|
| 🔐 Registrazione | Form con validazione, salvataggio in localStorage |
| 🎁 Gift Card | Card animata con flip 3D che rivela il codice |
| 🔑 Login | Accesso con email e password |
| 💳 Abbonamenti | 3 piani: Base (€4,99), Standard (€9,99), Premium (€19,99) |
| 🎬 Catalogo | 4 film + 4 serie TV (6 episodi ciascuna) |
| 🔒 Contenuti Bloccati | Accesso riservato agli abbonati |
| 👤 Profilo Utente | Cambio avatar, impostazioni, sicurezza |
| 📱 Responsive | Adattato a smartphone, tablet e desktop |

---

## 🗂 Struttura Directory

```
fromvideo/
├── index.html              # Homepage
├── README.md               # Documentazione
├── assets/
│   └── images/             # Avatar SVG
├── css/
│   ├── style.css           # Stili globali + componenti
│   ├── home.css            # Stili homepage
│   ├── auth.css            # Stili registrazione/login + gift card
│   ├── login-extra.css     # Stili aggiuntivi login
│   ├── catalog.css         # Stili catalogo
│   ├── plans.css           # Stili abbonamenti
│   └── profile.css         # Stili profilo
├── js/
│   ├── app.js              # Logica core (Auth, Storage, Toast)
│   └── catalog.js          # Dati catalogo e player
└── pages/
    ├── login.html          # Pagina di accesso
    ├── register.html       # Pagina di registrazione
    ├── catalog.html        # Catalogo film e serie
    ├── plans.html          # Piani di abbonamento
    └── profile.html        # Profilo utente
```

---

## 🛠 Tecnologie Utilizzate

- **HTML5** — struttura semantica delle pagine
- **CSS3** — design moderno con variabili CSS, Grid, Flexbox, animazioni
- **JavaScript (Vanilla)** — logica client-side, localStorage, interattività
- **Google Fonts** — Bebas Neue (display) + Outfit (corpo testo)
- **Netlify** — hosting e deploy automatico
- **GitHub** — controllo versione

---

## 🎨 Design

- **Palette:** Nero `#0A0A0F` + Blu `#2563EB` + Accenti `#60A5FA`
- **Font:** Bebas Neue (titoli) + Outfit (testo)
- **Stile:** Dark mode, moderno, ispirato a Netflix/Disney+
- **Animazioni:** Gift card flip 3D, hover effects, toast notifications

---

## 📋 Come Usare

1. **Registrati** su `/pages/register.html`
2. **Clicca la gift card** per ottenere il codice
3. Vai su **Abbonamenti** → "Usa Codice" e inserisci il codice
4. Accedi al **Catalogo** e guarda film e serie

---

## 📝 Note Tecniche

- Tutti i dati sono salvati in **localStorage** (nessun backend)
- Il pagamento è **solo simulato** (nessuna transazione reale)
- I contenuti video sono **fittizi** (nessun video reale)
- Compatibile con Chrome, Firefox, Safari, Edge

---

## 👨‍💻 Autore

**Kristian Lefter** — Classe 4I  
Anno Scolastico 2025/2026  
Tesina Tecnica 
AFMG
