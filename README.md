# Hull Shortener Ship.

Run code to update User Properties and generate Events whenever Users are updated or perform events.

If you want your own instance: [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/hull-ships/hull-shortener)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhull-ships%2Fhull-shortener.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhull-ships%2Fhull-shortener?ref=badge_shield)

End-Users: [See Readme here](https://dashboard.hullapp.io/readme?url=https://hull-shortener.herokuapp.com)
---

### Using :

- Go to your `Hull Dashboard > Ships > Add new`
- Paste the URL for your Heroku deployment, or use ours : `https://hull-shortener.herokuapp.com/`

### Developing :

- Fork
- Install

```sh
npm install -g gulp
npm install
gulp
```

Open your mongo shell, select your db and run this to initialize the db:
```
  db.counters.insert({ _id: 'url_count', seq: 1 })
```


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhull-ships%2Fhull-shortener.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhull-ships%2Fhull-shortener?ref=badge_large)