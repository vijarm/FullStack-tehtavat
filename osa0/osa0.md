0.4: Uusi muistiinpano

```mermaid
sequenceDiagram
    participant selain
    participant serveri

    selain->>serveri: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate serveri
    serveri-->>selain: 302 redirect /exampleapp/notes
    deactivate serveri

    Note right of selain: Lomakkeen viesti siirtyy POSTin mukana serverille, paluuna redirect sivun uudelleen lataamiseen

    selain->>serveri: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate serveri
    serveri-->>selain: HTML tiedosto
    deactivate serveri
    
    selain->>serveri: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate serveri
    serveri-->>selain: css tiedosto
    deactivate serveri
    
    selain->>serveri: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate serveri
    serveri-->>selain: JavaScript tiedosto
    deactivate serveri
    
    Note right of selain: Selain aloittaa suorittamaan JavaScriptia ja hakee JSON tiedoston serveriltä
    
    selain->>serveri: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate serveri
    serveri-->>selain: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate serveri    

    Note right of selain: datan saapuessa selain suorittaa tapahtumankäsittelijän, joka renderöi muistiinpanot ruudulle käyttäen DOM-apia
```


0.5: Single Page App

```mermaid
sequenceDiagram
    participant selain
    participant serveri

    selain->>serveri: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate serveri
    serveri-->>selain: HTML tiedosto
    deactivate serveri
    
    selain->>serveri: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate serveri
    serveri-->>selain: css tiedosto
    deactivate serveri
    
    selain->>serveri: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate serveri
    serveri-->>selain: spa javaScript tiedosto
    deactivate serveri
    
    Note right of selain: Selain aloittaa suorittamaan JavaScriptia ja hakee JSON tiedoston serveriltä
    
    selain->>serveri: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate serveri
    serveri-->>selain: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate serveri    

    Note right of selain: datan saapuessa selain suorittaa tapahtumankäsittelijän, joka renderöi muistiinpanot ruudulle käyttäen DOM-apia
```

0.6: Uusi muistiinpano

```mermaid
sequenceDiagram
    participant selain
    participant serveri

    selain->>serveri: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate serveri
    serveri-->>selain: 201 vastaus "Note created"
    deactivate serveri    

    Note right of selain: Lomakkeen viesti ja aikaleima siirtyvät POSTin mukana JSON-muodossa serverille
    Note left of serveri: Serveri kuittaa viestin saapuneeksi. Koko sivu ei lataudu uudelleen, vaan javascript piirtää vain muistiinpanot uudelleen.
```

Lisätään vielä viimeiseen tehtävään, että koodin perusteella ymmärsin noten kirjoitettavan sivulle uudelleen riippumatta siitä mitä serverin puolella tapahtuu:
Ensin lisätään note, piirretään lista uudelleen, ja vasta sen jälkeen tapahtuu "sendToServer", enkä näe mitään yhteyttä että serverin tapahtumat enää vaikuttaisivat käyttäjälle uuden noten tulostumiseen.
Oikeastaan siis note kirjoitetaan uudelleen käyttäjän näytölle ennen kuin nuoli edes lähtee serverin suuntaan. 

