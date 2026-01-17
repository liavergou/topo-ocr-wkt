# CoordAiExtractor - React Frontend App

## Πώς Λειτουργεί
Το έργο χωρίζεται σε δύο μέρη:

*   **Backend**: [WebAiAPIPro](https://github.com/liavergou/WebAiAPIPro.git)
*   **Frontend**: [topo-ocr-wkt](https://github.com/liavergou/topo-ocr-wkt.git)

> Το παρόν repository αφορά μόνο το **Frontend**.

## Πίνακας Περιεχομένων

1. [Περιγραφή](#1-περιγραφή)
2. [Λειτουργικότητα](#2-λειτουργικότητα)
    - [Σελίδες Διαχείρισης](#σελίδες-διαχείρισης-role-based-access-admin-manager)
    - [Authentication & Authorization](#authentication--authorization)
    - [Επιλογή Μελέτης](#επιλογή-μελέτης)
    - [Χάρτης Προβολής](#χάρτης-προβολής-πολυγώνων-μελέτης)
    - [Εργασία Μετατροπής](#δημιουργίαεπεξεργασία-εργασίας-μετατροπής-conversion-job-σε-επιλεγμένη-μελέτη)

3. [Δομή](#3-δομή)
4. [Tech Stack](#4-tech-stack)
    - [Frontend](#frontend)
    - [Εξωτερικές Υπηρεσίες](#εξωτερικές-υπηρεσίες)
5. [Εγκατάσταση](#5-εγκατάσταση)
6. [Ανάπτυξη σε Παραγωγή (Production) σε τοπικό δίκτυο (LAN)](#6-ανάπτυξη-σε-παραγωγή-production-σε-τοπικό-δίκτυο-lan)
7. [Demo Video](#7-demo-video)


## 1. Περιγραφή
Το CoordAiExtractor είναι μια εταιρική web εφαρμογή που εξάγει αυτόματα συντεταγμένες από σαρωμένα τοπογραφικά διαγράμματα (jpg,png). Για το OCR χρησιμοποιείται custom prompting μέσω LLM. Ο χρήστης μπορεί να επιλέξει το prompt ανάλογα με τον τύπο του πίνακα συντεταγμένων.
Τα δεδομένα μετατρέπονται σε πολύγωνα και εμφανίζονται σε χάρτη για οπτικό έλεγχο και επεξεργασία του πίνακα συντεταγμένων. Κάθε μελέτη προβάλλεται μέσω GeoServer WFS και μπορεί να εξαχθεί σε Shapefile.

## 2. Λειτουργικότητα

### Σελίδες Διαχείρισης (Role-based access: Admin, Manager)

- **Διαχείριση Χρηστών**
  Κεντρική διαχείριση χρηστών, ρόλων και αναθέσεων μελετών σε χρήστες με role: Member.
    - **Admin, Manager**: Πλήρη δικαιώματα (διαχείριση χρηστών, prompts, μελετών)
    - **Member**: Προβολή, δημιουργία και επεξεργασία μετατροπών (jobs) στις μελέτες που του έχουν ανατεθεί

- **Διαχείριση Μελετών**
  Περιβάλλον διαχείρισης μελετών με υποστήριξη pagination και φίλτρου.
    - Δημιουργία, επεξεργασία, διαγραφή μελετών.

- **Διαχείριση Prompts**
  Περιβάλλον διαχείρισης των οδηγιών (prompts) προς το μοντέλο τεχνητής νοημοσύνης.
    - Δημιουργία, επεξεργασία, διαγραφή prompts.
    - Διαφορετικά prompts για διαφορετικούς τύπους πινάκων (οριζόντια ανάγνωση, κάθετη ανάγνωση,ανάγνωση σειράς από πίνακα κ.λ.π.)

### Authentication & Authorization
- **Keycloak** - OAuth2 + JWT Authentication
- **Role-Based Access Control** - Admin, Manager, Member (Conditional rendering UI βάσει ρόλων)
- **Automatic Token Refresh** - Διαχείριση session και ανανέωση token (Refresh Token flow) μέσω της βιβλιοθήκης `react-keycloak/web`.
- **Silent Check SSO** - Αυτόματος έλεγχος session στο background κατά τη φόρτωση (χωρίς redirect).

> **Σημείωση**: Όλα τα http requests προς το backend περιλαμβάνουν το JWT token στον `Authorization` header: `Authorization: Bearer <token>`.

### Επιλογή μελέτης
- Οι υπάρχουσες ενεργές μελέτες εμφανίζονται ανάλογα με τον ρόλο του χρήστη

### Χάρτης προβολής πολυγώνων μελέτης

Υπόβαθρα:
- **Google Satellite xyz tile layer** - Δορυφορικό υπόβαθρο μέσω Google Maps Tile Servers
- **WMS Ελληνικού Κτηματολογίου** - Υπηρεσία θέασης ορθοφωτοχαρτών (OGC WMS 1.1.0).

Σύστημα Συντεταγμένων & Προβολή:
- **WGS84 (EPSG:4326)**: Χρησιμοποιείται για την εμφάνιση δεδομένων στον χάρτη (Google Maps, WMS, GeoServer WFS).
- **ΕΓΣΑ87 (EPSG:2100)**: Client-side μετατροπές (Proj4.js) για επεξεργασία πολυγώνου και εμφάνιση συντεταγμένων (Mouse Coordinates).

- **Πολύγωνα**: Εμφάνιση με χρωματική κωδικοποίηση
    - Μωβ: Ενεργά
    - Κόκκινο: Διαγραμμένα
    - Κίτρινο: Επιλεγμένο
- **Mouse Coordinates**: Real-time εμφάνιση συντεταγμένων σε ΕΓΣΑ87
- **Συγχρονισμός Χάρτη-Πίνακα εργασιών μετατροπής**: Αμφίδρομη επιλογή. Η επιλογή πολυγώνου στο χάρτη επιλέγει την αντίστοιχη εγγραφή στον πίνακα και η επιλογή εγγραφής εστιάζει (zoom) στο αντίστοιχο πολύγωνο.
- **Φίλτρο εμφάνισης πολυγώνων**: Όλα, Ενεργά, Διεγραμμένα
- **Διαγραφή, επεξεργασία επιλεγμένου πολυγώνου**

### Δημιουργία/Επεξεργασία εργασίας μετατροπής (conversion job) σε επιλεγμένη μελέτη
- Φόρτωση και εμφάνισης εικόνας σαρωμένου τοπογραφικού διαγράμματος με drag & drop ή από τον τοπικό δίσκο
- Rotation εικόνας
- Zoom In / Zoom Out μέσω ποντικού
- Επιλογή περιοχής πίνακα συντεταγμένων (crop)
- Επιλογή AI Prompt για OCR
- Upload εικόνας (Client-side image cropping με αποστολή Blob μέσω FormData)
- Μετατροπή εικόνας σε WKT μέσω Gemini LLM και back-end parsing σε δομημένο JSON (Coordinate[])
- Αυτόματη εξαγωγή πίνακα συντεταγμένων και οπτικοποίηση πολυγώνου (το παραγόμενο WKT έχει μετατραπεί σε δομημένο πίνακα συντεταγμένων)
- Αυτόματος υπολογισμός εμβαδού
- Επεξεργασία συντεταγμένων με real-time preview στο χάρτη
- Αποθήκευση αλλαγών
- Εξαγωγή συντεταγμένων σε txt (client-side export)
- Διαγραφή (soft delete) πολυγώνου



## 3. Δομή

```bash
src/
├── assets/              # Στατικά αρχεία
├── components/          # UI Components
│   ├── conversion/      # Upload, επεξεργασία εικόνας & OCR
│   ├── layout/          # Dashboard layout & Footer
│   ├── map/             # Χάρτης & Πίνακας Συντεταγμένων
│   ├── pages/           # Σελίδες Εφαρμογής (Routes)
│   └── ui/              # Κοινόχρηστα στοιχεία
├── hooks/               # Custom Hooks
├── services/            # API calls & Axios services
│   ├── api.service.ts   # Ρύθμιση Axios & JWT Interceptors
│   ├── api.projects.ts  # Διαχείριση μελετών
│   ├── api.jobs.ts      # Διαχείριση Εργασιών Μετατροπής (OCR Jobs)
│   ├── api.prompts.ts   # Διαχείριση AI Prompts
│   ├── api.users.ts     # Διαχείριση Χρηστών
│   └── api.account.ts   # Ανάκτηση Μελετών Χρήστη (Role: Member)
├── schemas/             # Zod Validation schemas
├── utils/               # Βοηθητικές συναρτήσεις
├── types.ts             # TypeScript Type Definitions
├── theme.ts             # MUI Theme Configuration
├── App.tsx              # Main App Component & Routing
└── main.tsx             # Main Entry Point
```

## 4. Tech Stack

### Frontend

- **React v19** με TypeScript
- **Vite v7** development και build
- **Material-UI v7** & **MUI X Data Grid** UI components & styling
- **Tailwind CSS v4** utility classes για layout
- **React Router v7** navigation
- **Leaflet** & **React Leaflet v5** JavaScript βιβλιοθήκη για διαδραστικούς χάρτες
- **Proj4.js** μετατροπές συστημάτων συντεταγμένων
- **Axios** HTTP requests
- **Zod v4** & **React Hook Form v7** form validation
- **React-cropper v2** image cropping

### Εξωτερικές Υπηρεσίες
- **Keycloak v25** - Authentication & Identity Management
- **GeoServer** - WFS Layer Visualization (Μέσω του Backend)


## 5. Εγκατάσταση

ΣΗΜΑΝΤΙΚΟ: Για τη λειτουργία της εφαρμογής απαιτείται να τρέχουν τα παρακάτω:   
- Keycloak Server    
- Backend API    
- GeoServer  

Οδηγίες για την εγκατάστασή τους θα βρείτε στο Backend Repository: https://github.com/liavergou/WebAiAPIPro.git

### Απαιτήσεις
- Node.js >= 20.0.0
- npm >= 10.0.0

### Setup

1. Clone το repository:
```bash
git clone https://github.com/liavergou/topo-ocr-wkt.git
cd topo-ocr-wkt
```

2. Εγκατάσταση dependencies:
```bash
npm install
```

3. Ρύθμιση environment variables:

Δημιουργήστε αρχείο `.env.development` στο root του project (αντιγράφοντας το `.env.example`):

```env
VITE_KEYCLOAK_URL=http://localhost:8080      # keycloak server url     
VITE_KEYCLOAK_REALM=TopoApp                  # Το όνομα του Realm
VITE_KEYCLOAK_CLIENT_ID=react-app            # Public Client ID (Frontend)
VITE_API_BASE=http://localhost:5000          # Backend API Base URL
```

4. Εκκίνηση development server:
```bash
npm run dev
```

Η εφαρμογή θα τρέχει στο `http://localhost:5173`



## 6. Ανάπτυξη σε Παραγωγή (Production) σε τοπικό δίκτυο (LAN)

Η εφαρμογή δοκιμάστηκε σε τοπικό δίκτυο (LAN) με IIS (Production Simulation).
> **Σημείωση:** Για τη λειτουργία του IIS απαιτείται έκδοση **Windows 10/11 Pro** και πρέπει να ενεργοποιηθεί από τα **Windows Features** (Turn Windows features on or off).

### Ρύθμιση IIS

1. **Build για production:**

Δημιουργήστε αρχείο `.env.production` με τις production μεταβλητές:

```env
VITE_KEYCLOAK_URL=http://<SERVER_IP>:8080
VITE_KEYCLOAK_REALM=TopoApp
VITE_KEYCLOAK_CLIENT_ID=react-app
VITE_API_BASE=http://<SERVER_IP>:8091
```

**Παράδειγμα:** Αντικαταστήστε `<SERVER_IP>` με τη στατική IP του server σας (π.χ. `192.168.1.3`)

Εκτέλεση build:
```bash
npm run build
```

2. **IIS Configuration:**
    - **Create Website**: Port `8090`
    - **Physical Path**: Deploy το περιεχόμενο του φακέλου `dist/` (π.χ. `D:\Publish\Frontend`)
    - **App Pool**: Ρύθμιση σε "No Managed Code"
    - **Εγκατάσταση:** [IIS URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite) (Απαιτείται)

3. **web.config (URL Rewrite Configuration):**

Δημιουργήστε αρχείο `web.config` στον **published** φάκελο (π.χ. `D:\Publish\Frontend\web.config`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="React Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

4. **Production URLs:**
    - Frontend: `http://<SERVER_IP>:8090/`
    - Backend API: `http://<SERVER_IP>:8091/`
    - Keycloak: `http://<SERVER_IP>:8080/`

**Παράδειγμα:** Με IP `192.168.1.3`, το frontend θα είναι διαθέσιμο στο `http://192.168.1.3:8090/`



## 7. Demo Video
[Watch the Demo Video](demo/demo.mp4)

## 8. Μελλοντικές Επεκτάσεις (Roadmap)
- **Υποστήριξη PDF/TIFF**: Δυνατότητα OCR από πολυσελιδα έγγραφα PDF και αρχεία TIFF.
- **Batch Processing**: Μαζική εισαγωγή και επεξεργασία πολλαπλών εικόνων.
- **Εξαγωγή σε GeoJSON/KML**: Επιπλέον formats εξαγωγής πέρα από το txt/wkt.

## Δημιουργός

**Βέργου Ευαγγελία**
*   **Coding Factory 8** - Athens University of Economics and Business (AUEB)
*   GitHub: [@liavergou](https://github.com/liavergou)

&copy;Developed 2025-2026 Vergou Evangelia. Developed as final project of Coding Factory 8