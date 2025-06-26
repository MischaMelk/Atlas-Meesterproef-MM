import express from 'express';
import fetch from 'node-fetch'; // of global fetch bij Node 18+
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

// Setup voor Liquid
import { Liquid } from 'liquidjs';
const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './server/views');
app.set('view engine', 'liquid');

// Static bestanden
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/client', express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../dist')));


const jsonAdress = 'https://fdnd-agency.directus.app/items/atlas_address/';
const jsonPerson = 'https://fdnd-agency.directus.app/items/atlas_person/';
const jsonPoster = 'https://fdnd-agency.directus.app/items/atlas_poster/';
const jsonFamily = 'https://fdnd-agency.directus.app/items/atlas_family/';



app.use(async (req, res, next) => {
  try {
    const addressRes = await fetch(jsonAdress);
    const adressen = (await addressRes.json()).data;

    const straten = [...new Set(
      adressen
        .map(adres => adres.street?.trim())
        .filter(Boolean)
    )];

    res.locals.straten = straten; // beschikbaar in alle templates
    next();
  } catch (err) {
    console.error('Fout bij ophalen van adressen:', err);
    res.locals.straten = []; // fallback
    next();
  }
});


// Route
app.get('/', async (req, res) => {
  try {
    const personRes = await fetch(jsonPerson);
    const personen = (await personRes.json()).data;

    res.render('index', { personen });
  } catch (err) {
    console.error(err);
    res.status(500).send('Fout bij ophalen van API');
  }
});


import fs from 'fs/promises';


app.get('/verhaal/:naam', async (req, res) => {
  try {
    const naam = decodeURIComponent(req.params.naam);

    const storyPath = path.join(__dirname, '../client/public/story.json');
    const rawData = await fs.readFile(storyPath, 'utf-8');
    const storyData = JSON.parse(rawData);

    const persoon = storyData.personen.find(p => p.naam === naam);

    if (!persoon) {
      return res.status(404).send('Persoon niet gevonden');
    }

    res.render('generic', {
      naam: persoon.naam,
      familie: persoon.familie,
      beroep: persoon.beroep,
      verhaal: persoon.verhaal
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Fout bij ophalen van verhaal');
  }
});


app.get('/oosterpark13', async (req, res) => {
  try {
    // Hardcoded waarden voor Oosterpark 13
    const straatnaam = 'Oosterpark';
    const huisnummer = 13;
    const toevoeging = null;

    const [addressRes, personRes] = await Promise.all([
      fetch(jsonAdress),
      fetch(jsonPerson)
    ]);

    const adressen = (await addressRes.json()).data;
    const personen = (await personRes.json()).data;

    const adres = adressen.find(adres =>
      adres.street?.trim() === straatnaam &&
      parseInt(adres.house_number, 10) === huisnummer &&
      ((adres.addition?.trim() || '') === (toevoeging || ''))
    );

    if (!adres) {
      return res.status(404).send('Adres niet gevonden');
    }

    const bewoners = personen.filter(persoon =>
      persoon.address_id === adres.id
    );

    res.render('detail', {
      straatnaam,
      huisnummer,
      toevoeging,
      adres,
      bewoners
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Fout bij ophalen van Oosterpark 13');
  }
});







app.get('/:straatnaam/:huisnummer', async (req, res) => {
  try {
    const straatnaam = decodeURIComponent(req.params.straatnaam.trim());
    const huisnummer = parseInt(req.params.huisnummer, 10);

    console.log(`Request voor: ${straatnaam} ${huisnummer}`);

    const jsonData = await fs.readFile('client/public/story.json', 'utf-8');
    const verhalen = JSON.parse(jsonData).personen;

    console.log(`Aantal verhalen: ${verhalen.length}`);

    const randomVerhaal = verhalen[Math.floor(Math.random() * verhalen.length)];

    console.log(`Gekozen verhaal: ${randomVerhaal.naam}`);

    res.render('generic', { persoon: randomVerhaal });


  } catch (err) {
    console.error('Fout in route:', err);
    res.status(500).send('Fout bij ophalen van pagina');
  }
});




app.get('/:straatnaam', async (req, res) => {
  const straatnaam = req.params.straatnaam;

  try {
    const adressenData = await fetch('https://fdnd-agency.directus.app/items/atlas_address/');
    const adressen = await adressenData.json();

    const huidigAdres = adressen.data.filter(adres => adres.street?.trim() === straatnaam);

    // Verwerk personen
    await Promise.all(huidigAdres.map(async (adres) => {
      const personen = adres.person;
      if (Array.isArray(personen) && personen.length > 0) {
        const personenData = await Promise.all(personen.map(async (persoonId) => {
          const persoonData = await fetch(`https://fdnd-agency.directus.app/items/atlas_person/${persoonId}`);
          const persoonJson = await persoonData.json();
          return persoonJson.data;
        }));
        adres.last_name = personenData[0]?.last_name ?? 'Onbekend';
      } else {
        adres.last_name = 'Onbekend';
      }
    }));

    // Bepaal vorige en volgende straat
    const straten = res.locals.straten;
    const currentIndex = straten.indexOf(straatnaam);
    const vorigeStraat = currentIndex > 0 ? straten[currentIndex - 1] : null;
    const volgendeStraat = currentIndex < straten.length - 1 ? straten[currentIndex + 1] : null;

    // Render de pagina met extra data
    res.render('street', {
      huidigAdres,
      straatnaam,
      vorigeStraat,
      volgendeStraat
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Fout bij ophalen van API');
  }
});




const port = 3000;
app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});

