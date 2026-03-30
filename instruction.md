# Historique des features — AcLabProject

## Authentification JWT (v0.4.0)

### Ce qui a été fait

#### Backend

**Dépendances ajoutées (`pom.xml`) :**
- `spring-boot-starter-security`
- `jjwt-api` / `jjwt-impl` / `jjwt-jackson` v0.12.3

**Nouveaux fichiers :**
- `model/User.java` — entité JPA, implémente `UserDetails`, champ `email` (unique) + `password` hashé
- `model/LoginRequest.java` — record `(email, password)`
- `model/RegisterRequest.java` — record `(email, password)`
- `model/AuthResponse.java` — record `(token, email)`
- `repository/UserRepository.java` — `findByEmail`, `existsByEmail`
- `security/JwtService.java` — génération/validation JWT (HS256, secret Base64)
- `security/UserDetailsServiceImpl.java` — charge l'utilisateur par email
- `security/JwtAuthenticationFilter.java` — filtre `OncePerRequestFilter`, lit le header `Authorization: Bearer <token>`
- `service/AuthService.java` — logique register/login, BCrypt, `AuthenticationManager`
- `controller/AuthController.java` — `POST /api/auth/register`, `POST /api/auth/login`
- `config/SecurityConfig.java` — configuration Spring Security + CORS centralisé

**`application.yml` :**
- Ajout de `jwt.secret` (env var `JWT_SECRET`, valeur par défaut dev fournie)
- Ajout de `jwt.expiration` (24h = 86400000 ms)

**Règles de sécurité :**
| Route | Accès |
|-------|-------|
| `POST /api/auth/**` | Public |
| `GET /api/photos/**` | Public |
| `POST /api/contact` | Public |
| `POST /api/photos` | Authentifié (JWT requis) |
| `DELETE /api/photos/**` | Authentifié (JWT requis) |

**Note :** `CorsConfig.java` (WebMvcConfigurer) est toujours présent mais la config CORS effective est dans `SecurityConfig.corsConfigurationSource()`.

---

#### Frontend

**Nouveaux fichiers :**
- `src/services/authService.js` — `login()`, `register()`, `logout()`, `getToken()`, `isAuthenticated()`
  - Token stocké dans `localStorage` sous la clé `authToken`
  - Email stocké sous `authEmail`
- `src/components/AuthPage.jsx` — page d'auth avec deux onglets (Connexion / Inscription)

**Fichiers modifiés :**
- `src/main.jsx` — ajout de la route `/auth` → `<AuthPage />`
- `src/App.css` — ajout des styles `.auth-page`, `.auth-card`, `.auth-tabs`, `.auth-tab`, etc.

**Comportement :**
- La page principale (`/`) reste accessible sans connexion
- `/auth` affiche le formulaire login/inscription
- Après succès, redirection vers `/`
- Lien « Retour à la galerie » présent sur la page auth

---

### Pour les futures features

**Envoyer un token dans les requêtes protégées (POST/DELETE photos) :**
```js
import { getToken } from '../services/authService.js';

fetch('/api/photos', {
  method: 'POST',
  headers: { Authorization: `Bearer ${getToken()}` },
  body: formData,
});
```

**Afficher un lien "Se connecter" dans le header :**
Utiliser `isAuthenticated()` et `getEmail()` depuis `authService.js`.

**Protéger des routes frontend :**
Créer un composant `ProtectedRoute` qui vérifie `isAuthenticated()` et redirige vers `/auth` sinon.

**Variables d'environnement production :**
- `JWT_SECRET` — secret Base64 ≥ 256 bits, à définir dans l'environnement de déploiement
