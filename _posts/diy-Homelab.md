---
title: "Mijn DIY Homelab: Van Houten Serverkast tot Proxmox Cluster & Custom Koeling"
excerpt: "Waarom maandelijks honderden euro's betalen voor externe cloud-servers als je met creativiteit, hardware en code je eigen datacenter kunt bouwen?"
coverImage: "/assets/blog/homelab/cover.webp"
date: "2026-05-06T19:55:00.000Z"
author:
  name: Milan Mareels
  picture: "/assets/blog/authors/milan-mareels.webp"
ogImage:
  url: "/assets/blog/homelab/cover.webp"
---

Waarom zou je maandelijks honderden euro's betalen voor externe cloud-servers als je met een beetje creativiteit, rondslingerende hardware en wat slim programmeerwerk je eigen, schaalbare datacenter kunt bouwen? Dat was de vraag die ik mezelf stelde toen ik keek naar de alsmaar stijgende abonnementskosten voor cloud-hosting. Ik wilde volledige controle over mijn data, meer rekenkracht, en eerlijk is eerlijk: ik had gewoon zin in een gigantisch nerd-project.

Het resultaat? Een volledig zelfgebouwd homelab met een Proxmox-cluster, strak kabelmanagement, streng gescheiden workloads en een eigen IoT-koelingssysteem. In deze blog neem ik je uitgebreid mee in de opbouw van mijn setup, de logische (en soms onlogische) indeling van mijn servers, en de technologie die dit hele ecosysteem dag en nacht draaiende houdt.

---

## De Fysieke Setup: Hout, Thin Clients en (Mislukte) 3D-Prints

Laten we eerlijk zijn: als het op techniek aankomt - hardware configureren, complexe netwerken bouwen en duizenden regels code kloppen - voel ik me als een vis in het water. Maar zodra er een hamer, een zaag of een 3D-printer bij komt kijken? Laten we zeggen dat daar nog héél wat ruimte voor verbetering is. Ik ben een pro met een toetsenbord, maar een absolute amateur in de werkplaats.

Ik wilde bewust geen standaard, lelijk en zwaar metalen serverrack in huis halen. Die dingen maken doorgaans veel te veel lawaai en passen nergens mooi in de kamer. Daarom besloot ik het rack volledig zelf te ontwerpen en op maat te bouwen uit hout. Hout isoleert geluid verrassend goed en gaf me de vrijheid om de kast perfect af te stemmen op de afmetingen van mijn apparatuur. Het houten frame staat (wonder boven wonder) ontzettend stevig, maar qua afwerking is het duidelijk dat mijn timmermansoog nog een flinke kalibratie nodig heeft.

Om dat gebrek aan houtbewerkings-skills te compenseren, dacht ik slim te zijn door de interne houders voor de servers en de netwerkapparatuur te **3D-printen**. Dat klonk in mijn hoofd als een geweldig, high-tech plan, maar de uitvoering was... tja, laten we het "artistiek" noemen.

![Mijn custom houten serverkast met 3D-geprinte houders](/assets/blog/homelab/serverkast.webp)

> **Kleine opmerking bij de foto:** Kijk maar eens goed naar die 3D-geprinte houder van de switch. Zoals je ziet is deze niet bepaald goed gelukt. Hij hangt er een beetje treurig en scheef bij, alsof hij het gewicht van het internet niet meer aan kan, en is dringend aan vervanging toe. Maar hé: zolang de pakketjes door de switch vliegen, klaag ik niet!

Omdat de buitenkant natuurlijk niet het hele verhaal vertelt, is hier ook een blik op de binnenkant van de kast, waar de echte magie gebeurt:

![Binnenkant van de serverkast met kabelmanagement en Thin Clients](/assets/blog/homelab/serverkast-binnen.webp)

De basis van mijn hardware bestaat niet uit stroomslurpende, luidruchtige enterprise-servers, maar uit twee uiterst efficiënte en stille Thin Clients (Tiny PC's):

- **Node 1 (PVE):** Een Intel i5-6500 met 16 GB RAM. Dit is het werkpaard voor de zware productieomgevingen.
- **Node 2 (PVE2):** Een Intel i5-6400U met 14 GB RAM. Perfect voor de meer algemene workloads, containers en achtergrondprocessen.

Alles is aangesloten op een 5-poorts gigabit switch. Om te voorkomen dat het een onoverzichtelijke spaghetti aan kabels werd, heb ik een eigen, compact patchpanel geïnstalleerd. Dit zorgt voor een strakke afwerking en maakt het troubleshooten een stuk eenvoudiger als er ooit een kabelbreuk mocht zijn.

---

## De Brains: Een Proxmox Cluster

Hoewel de behuizing misschien basic er uit ziet, is de binnenkant pure digitale perfectie. Om de hardware van beide Thin Clients maximaal en efficiënt te benutten, draaien de servers op **Proxmox VE** in een clusteropstelling.

Virtualisatie is de absolute sleutel tot het succes van dit project. Proxmox stelt me in staat om de rekenkracht, het geheugen en de opslag dynamisch te verdelen over diverse Ubuntu Virtual Machines (VM's) en lichte Docker/Portainer containers. Bovendien kan ik via de cluster-interface beide fysieke machines vanuit één overzichtelijk dashboard beheren.

Mijn belangrijkste vuistregel bij het inrichten van dit cluster was **strikte scheiding**. Privé-zaken, gevaarlijke experimenten en kritieke productiewerklasten mogen elkaar nóóit in de weg zitten. Als mijn Minecraft-server crasht, mag een website van een klant daar absoluut niets van merken. Daarom is mijn cluster logisch opgesplitst in 5 specifieke doelen:

### 1. De Homeserver (PVE 2)

Dit is mijn digitale woonkamer en dagelijkse speeltuin. Hier draait alles wat ik in en rond het huis gebruik:

- **Plex** voor het streamen van al mijn films en series.
- **Home Assistant** voor de complete automatisatie van mijn smart home (lampen, sensoren, routines).
- Diverse muziekdiensten en handige self-hosted Docker containers, zoals uptime-monitoring.

### 2. VM Hosting (PVE 2)

Dit is een afgeschermd, gereserveerd gedeelte waar een vriend van me virtuele machines host voor zijn eigen development projectjes. Ik voorzie de stabiele Ubuntu-infrastructuur, hij kan veilig experimenteren.

### 3. De Research Server (PVE 2)

Hier ben ik misschien wel het meest trots op. Ik heb een zware, compleet geïsoleerde Ubuntu-server draaien die dedicated is aan wetenschappelijk onderzoek (vaak via BOINC/Folding@Home achtige projecten). Deze server doneert 24/7 ongebruikte rekenkracht aan de wetenschap: van het analyseren van medische data voor hart- en vaatziekten tot het verwerken van complexe berekeningen voor astronomisch ruimte-onderzoek.

### 4. De Game Server (PVE 2)

Tijd om even af te schakelen! Hier host ik een eigen Minecraft-server (zowel Java als Bedrock via Crafty). Omdat deze virtuele machine op de specifieke hardware van PVE2 draait, heeft de server ruimschoots genoeg power om een soepele, lag-vrije multiplayer-ervaring te garanderen voor vrienden, zonder dat het de productie-omgeving ook maar een milliseconde vertraagt.

### 5. De Production Server (PVE)

Dit is het absolute, kloppende zakelijke hart van mijn homelab. Als eigenaar van **[Lannie](https://www.lannie.be/)** - mijn bedrijfje voor professioneel webdesign en development - heb ik een rock-solid, altijd bereikbare omgeving nodig voor de websites en applicaties van mijn klanten.

- **Hardware:** Exclusief gekoppeld aan de krachtigste node, PVE (Intel i5-6500).
- **Tech Stack:** De infrastructuur draait op Docker en Portainer, beheerd via NGINX reverse proxies. Databases worden gestuurd door MongoDB.
- **Beveiliging:** Ik maak gebruik van Cloudflare Tunnels, wat betekent dat ik geen poorten op mijn router hoef open te zetten, maar het verkeer veilig en versleuteld via de edge-netwerken van Cloudflare loopt.
- **CI/CD:** Deployments zijn volledig geautomatiseerd via Portainer polling. Zodra ik nieuwe code push, staat de update binnen enkele seconden live bij de klant.

---

## Overal Veilig Bereikbaar: Tailscale VPN

Een homelab is geweldig, maar wat als je niet thuis bent en er gaat iets mis? Om mijn netwerk vanaf elke locatie ter wereld veilig te kunnen beheren, heb ik **Tailscale** geïmplementeerd in mijn setup.

Tailscale is een Zero-Config mesh VPN gebouwd bovenop WireGuard. In plaats van ingewikkelde port-forwarding regels in mijn router te moeten instellen (wat een enorm veiligheidsrisico is), verbindt Tailscale al mijn apparaten - mijn telefoon, laptop en de servers in het homelab - in één beveiligd privé-netwerk. Waar ik ook ben, ik kan direct inloggen op mijn Proxmox dashboard, SSH'en naar mijn Ubuntu VM's, of de Home Assistant interface openen alsof ik gewoon thuis op de bank zit. Het is naadloos, snel en vooral extreem veilig.

---

## The Custom Touch: Een IoT Koelingssysteem

Omdat alle hardware in een dichte, op maat gemaakte houten kast zit, is warmteopbouw een serieus risico. Hout houdt warmte helaas erg goed vast, dus airflow is cruciaal om de levensduur van de componenten te garanderen. In plaats van simpelweg een paar "domme" ventilatoren te installeren die altijd op 100% draaien, zag ik een kans om mijn passie voor code erop los te laten en een volledig custom, smart koelsysteem te bouwen.

Het brein van dit systeem is een **BBC micro:bit** die ik in TypeScript heb geprogrammeerd. De micro:bit leest continu de interne temperatuur in de kast uit via aangesloten sensoren. Afhankelijk van de hitte - verdeeld in de statussen 'passief', 'warm', of 'kritiek' - schakelt de micro:bit via een motor driver board verschillende 5V PC-ventilator-groepen in. Ik heb gekozen voor een Push/Pull configuratie: onderin wordt koude lucht naar binnen getrokken, en bovenin wordt de warme lucht actief weggeduwd.

Het allermooiste onderdeel hiervan? De micro:bit bestuurt niet alleen de ventilatoren, maar stuurt de verzamelde telemetrie-data (temperatuur, fan-snelheid, status) via een seriële USB-verbinding direct door naar mijn zelfgebouwde **C# .NET 8 Blazor Dashboard**.

Hieronder zie je een screenshot van dit basic dashboard. Het werkt op dit moment perfect voor wat er nodig is, al wordt dit in de toekomst natuurlijk nog verder uitgebreid. Het bouwen van zo'n C# applicatie ging me gelukkig in ieder geval véél beter af dan het afstellen van die 3D-printer!

![Live C# Blazor Koeling Dashboard](/assets/blog/homelab/koeling-dashboard.png)

> **Zelf bouwen?** Omdat ik sterk geloof in open-source, heb ik dit hele koelings- en monitoringsproject online gezet. Je kunt de volledige code voor de micro:bit, de C# Blazor setup en de documentatie terugvinden op mijn **[GitHub repository: ServerDashboard](https://github.com/MilanMareels/ServerDashboard)**. Voel je vrij om het te forken en in je eigen homelab te gebruiken!

---

## Waarom doe ik dit eigenlijk?

Waarom steek ik hier zoveel tijd, moeite (en frustratie met houtlijm en 3D-printers) in? Simpel: om te blijven groeien. Een homelab is voor mij de ultieme speeltuin om nieuwe dingen te leren en technologieën uit te proberen die je op school simpelweg niet meekrijgt. Het is de perfecte, veilige zandbak om dingen kapot te maken en uit te zoeken hoe je ze weer repareert.

Daarnaast geeft het me de ultieme vrijheid. Ik kan mijn eigen projecten volledig zelf leiden, hosten en beheren, precies zoals ik dat wil. Geen afhankelijkheid meer van externe partijen, geen vendor lock-in bij dure cloud-providers, maar gewoon 100% eigenaarschap over mijn eigen data en infrastructuur.

---

## Conclusie & Wat is de Volgende Stap?

Dit homelab begon ooit als een klein experimenteel project om wat te leren over Linux en Docker, maar het is inmiddels uitgegroeid tot een krachtig, professioneel en onmisbaar ecosysteem. Het is de perfecte mix van mijn sterke punten (software, netwerken, infrastructuur) en de keiharde realiteit van mijn zwakke punten (houtbewerking en 3D-printen).

Het bewijst echter dat je geen perfecte meubelmaker hoeft te zijn om een professioneel, efficiënt datacenter te draaien. Het systeem biedt enorme schaalbaarheid dankzij het Proxmox-cluster, zekerheid door de geautomatiseerde deployments en monitoring, en het vormt de perfecte ruggengraat voor zowel de websites van Lannie als voor wetenschappelijk onderzoek. Het is self-hosted, razendsnel, schaalbaar en - het allerbelangrijkste - honderd procent van mij. (Oh, en fun fact: de blog die je op dit moment aan het lezen bent, draait dus ook gewoon op één van deze servers! :O)

Op naar de volgende upgrade... en hopelijk eerst de tijd vinden om die 3D-printer opnieuw te kalibreren zodat de switch-houder eindelijk wél recht hangt!

> **Speciale dank:** Naar mijn schoonvader voor het gebruik van zijn 3D-printer, de micro:bit en de lasersnijder. Zonder zijn apparatuur had ik dit project niet kunnen vervolledigen! :-)
