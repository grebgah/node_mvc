import Note from '../models/note.js'
import { escape } from 'html-escaper'

const getCreateNewNote = (req, res, next) => {
    res.render('note/noteViewCreate')
}

const getNote = async(req, res, next) => {
    if (!req.params.id) return res.status(400).send();
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send();

        res.render('note/noteViewSingle', note)
    } catch (e) {
        next(e);
    }
}

// Uuden noten luominen, ottaa vastaan POST requestin
const postCreateNewNote = async(req, res, next) => {

    try {
        // Ottaa vastaan POST requestin bodyssä seuraavat tiedot:
        // title, content
        const { title, content } = req.body

        // Tarkistetaan ettei mikään vaadituista tiedoista ole tyhjä,
        // jos on niin lähetetään error viesti middlewaren käsiteltäväksi
        if (!title || !content) return next('Kaikki kentät tulee täyttää')

        // Luodaan uusi Note instanssi Note modelin perusteella
        const note = new Note({
            // Poistetaan XSS haavoittuvuus
            title: escape(title),
            content: escape(content),
        });

        // Tallennetaan Note instanssin data tietokantaan
        const data = await note.save();

        // Jos tietokanta ei anna vastausta niin toiminto on epäonnistunut
        // ja lähetetään error status 500 - internal server error
        if (!data) return res.status(500).send()

        // Uusi data luotu onnistuneesti
        // Luodaan noteViewSingle html sivu ja palautetaan se selaimelle luodun note datan kanssa
        res.render('note/noteViewSingle', data)

    } catch (e) {
        // Jos ohjelma kaatuu niin lähetetään error middlewaren käsiteltäväksi
        next(e)
    }
}

const deleteNote = async(req, res, next) => {
    //jos vaadittu parametri puuttuu, antaa ilmoituksen error status 400 - Bad Request error
    if (!req.params.id) return res.status(400).send();
    try {
        // Tallennetaan Paste instanssin id:n perusteella haettuun yksittäiseen dokumenttiin
        const note = await Note.findById(req.params.id);
        // Jos tietokanta ei anna vastausta niin toiminto on epäonnistunut
        // ja lähetetään error status 404 - not found
        if (!note) return res.status(404).send();
        //kertoo että paste poistetaan
        await note.delete();

        // ilmoittaa onnistuneesta poistosta
        next("Poisto onnistui")

    } catch (e) {
        // Jos ohjelma kaatuu niin lähetetään error middlewaren käsiteltäväksi
        next(e);
    }
}

const getAllNotes = async(req, res, next) => {
    try {
        const noteItems = await Note.find({});
        if (!noteItems) return res.status(404).send();

        res.render('note/noteViewAll', { noteItems })
    } catch (e) {
        next(e);
    }
}

const getUpdateNote = async(req, res, next) => {
    if (!req.params.id) return res.status(400).send();
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).send();

        res.render('note/noteViewUpdate', note)
    } catch (e) {
        next(e);
    }
}

const postUpdateNote = async(req, res, next) => {
    if (!req.params.id) return res.status(400).send();
    try {
        const { title, content } = req.body
        if (!title || !content) return next('Kaikki kentät tulee täyttää')
        const note = await Note.findByIdAndUpdate(req.params.id, {title, content}, {new:true});
        if (!note) return res.status(404).send();

        res.render('note/noteViewSingle', note)
    } catch (e) {
        next(e);
    }
}

export default {
    getCreateNewNote,
    postCreateNewNote,
    getNote,
    deleteNote,
    getAllNotes,
    getUpdateNote,
    postUpdateNote


}