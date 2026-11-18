# Knickosh Federis | Portfolio

A minimal, premium purple-and-gold portfolio for an aspiring web developer. One smooth-scrolling page with a dark and a light theme, built with plain HTML, CSS and JavaScript (no frameworks).

**Live site:** https://knickosh.gt.tc

## Features

- Single scrolling page with a sticky navigation dock, scroll-spy highlighting and a scroll progress bar
- Reveal-on-scroll animations, animated hero name, typing text and count-up stats
- Dark and light theme (remembers the visitor's choice)
- Skills tabs (Technical, Personal, Languages)
- Projects shown in a minimal side-scroll rail with arrows and a counter
- Working contact form that delivers messages to Gmail through Web3Forms, with a "Send it with your email app" fallback
- Responsive from phones to wide desktops, with reduced-motion support and accessible navigation

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All sections: Home, About, Skills, Experience, Projects, Education, Contact |
| `style.css` | All styles. Colors are at the very top under `:root` |
| `script.js` | Navigation, animations, tabs, theme switch, projects rail, contact form |
| `contact.php` | Optional PHP form handler (only if you switch the form back to PHP) |
| `.htaccess` | Speed and security settings |
| `assets/img/knickosh.jpg` | Profile photo |
| `assets/Knickosh-Federis-Resume.pdf` | Resume file (optional, the Home button was replaced by "Let's talk") |

## Upload (InfinityFree)

1. Control Panel > Online File Manager (or FTP with FileZilla) > open `htdocs`.
2. Delete the old files so nothing outdated is left behind.
3. Upload everything inside this folder so `index.html` sits directly in `htdocs`.
4. Open your domain and press **Ctrl + Shift + R** to clear the cached version.

## Contact form setup (Web3Forms)

The form sends to `https://api.web3forms.com/submit` and uses an access key stored in `index.html`:

```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
```

- Messages arrive in the Gmail address linked to the key. Check Spam if nothing shows up.
- The key is not secret (it is visible in the page by design). Web3Forms limits where it works through the website/domain set in the form's settings, so add `localhost` there if you test locally.
- If the form shows an error, the reason is printed in brackets, for example `Invalid Access Key` or `Failed to fetch`.
- Prefer PHP? Change the form's `action` to `contact.php`. This needs a host where PHP `mail()` works.

## Test on your computer

Use **Live Server** in VS Code instead of double-clicking `index.html`. Opening it as a plain file can block the contact form from sending.

## Editing tips

- **Colors:** `style.css`, top of the file (`:root` is the dark theme, `html[data-theme="light"]` is the light theme). Purple is `--accent`, gold is `--gold`.
- **Text:** `index.html`.
- **Photo:** replace `assets/img/knickosh.jpg` (portrait, ratio about 5:8 looks best).
- **Raise or lower the photo:** at the end of `style.css`, change `.portrait { translate: 0 -56px; }`.
- **Name size:** at the end of `style.css`, change the `clamp(...)` in `.hero-name`.
- **Add a project:** in `index.html`, copy one `<li class="project">` inside the Projects list, change the number, title, description, chips and links, then update the Projects count in About (`data-count`).
- **Resume:** replace `assets/Knickosh-Federis-Resume.pdf` with your latest PDF (same name).

## Navigation

Click a dock button, scroll, press the left/right arrow keys, press **1-7** to jump to a section, or use the **top** button to go back to Home. On the Projects rail, swipe or use the arrows.

## Tech

HTML5, CSS3, vanilla JavaScript, Web3Forms.

## Author

Knickosh Federis, BS Information Technology, PHINMA Saint Jude College - Manila.
GitHub: https://github.com/kncksh
