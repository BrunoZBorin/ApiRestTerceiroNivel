const express = require('express');
const app = express();
app.use(express.json());


let people = Array.from({length: 1000}, (v,k) => { 
    return {
        'id': k + 1,
    };
});
people = [
    {
        "id": 1,
        "name": "Luke Skywalker",
        "height": "172",
        "mass": "77",
        "hair_color": "blond",
        "skin_color": "fair",
        "eye_color": "blue",
        "birth_year": "19BBY",
        "gender": "male",
        "homeworld": "https://swapi.dev/api/planets/1/",
        "films": [
            "https://swapi.dev/api/films/2/",
            "https://swapi.dev/api/films/6/",
            "https://swapi.dev/api/films/3/",
            "https://swapi.dev/api/films/1/",
            "https://swapi.dev/api/films/7/"
        ],
        "species": [
            "https://swapi.dev/api/species/1/"
        ],
        "vehicles": [
            "https://swapi.dev/api/vehicles/14/",
            "https://swapi.dev/api/vehicles/30/"
        ],
        "starships": [
            "https://swapi.dev/api/starships/12/",
            "https://swapi.dev/api/starships/22/"
        ],
        "created": "2014-12-09T13:50:51.644000Z",
        "edited": "2014-12-20T21:17:56.891000Z",
        "url": "https://swapi.dev/api/people/1/"
    },
    {
        "id": 2,
        "name": "C-3PO",
        "height": "167",
        "mass": "75",
        "hair_color": "n/a",
        "skin_color": "gold",
        "eye_color": "yellow",
        "birth_year": "112BBY",
        "gender": "n/a",
        "homeworld": "http://swapi.dev/api/planets/1/",
        "films": [
            "http://swapi.dev/api/films/1/",
            "http://swapi.dev/api/films/2/",
            "http://swapi.dev/api/films/3/",
            "http://swapi.dev/api/films/4/",
            "http://swapi.dev/api/films/5/",
            "http://swapi.dev/api/films/6/"
        ],
        "species": [
            "http://swapi.dev/api/species/2/"
        ],
        "vehicles": [],
        "starships": [],
        "created": "2014-12-10T15:10:51.357000Z",
        "edited": "2014-12-20T21:17:50.309000Z",
        "url": "http://swapi.dev/api/people/2/"
    }
]
app.get('/people', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let startIndex = (page - 1) * limit;
    let slice = people.sort((a,b) => a.id - b.id)
            .slice(startIndex, startIndex + limit);

    let total = people.length;

    let response = {
        _metadata: {
        pagination: {
                    page,
                    limit,
                    total,
            }
        },
        data: slice
    };
    res.set('Pagination-Count', total)
        .set('Pagination-Page', page)
        .set('Pagination-Limit', limit)
        .send(response);
});

app.post('/people', (req, res) => {
    let People = req.body;
    People.id = people.length + 1;
    people.push(People);
    res.status(201)
        .header('Location', '/people/' + People.id)
        .send(People);
});


app.get('/people/:id', (req, res) => {
    let person = people.find(person => person.id == req.params.id); 
    if (!person) {
        res.status(404).send({
            error: 'entity not found',
        });
        return;
    }
    res.send(person);
});


app.put('/people/:id', (req, res) => {
    const person = people.find(p => p.id == req.params.id); 
    if (!person) {
        res.status(404).send(); 
        return;
    }

    person.name = req.body.name; 
    res.status(200).send(person);
});

app.delete('/people/:id', (req, res) => {
    let person = people.find(person => person.id == req.params.id); 
    if (!person) {
        res.status(404).send();
        return; 
    }
    people = people.filter(person => person.id != req.params.id);
    res.status(204).send(); 
});
 



app.listen(3000, () =>console.log('Listening on port 3000'));