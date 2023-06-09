import { nanoid } from 'nanoid';
import { Component } from 'react';
import { Container, TitleForm, TitleContacts, Info } from './App.styled';
import ContactForm from '../ContactForm/ContactForm';
import ContactsList from '../ContactsList/ContactsList';
import Filter from '../Filter/Filter';
import { save, load } from '../Utils/Utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const KEY_CONTACTS = 'contacts';
class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const lsContacts = load(KEY_CONTACTS);
    if (lsContacts) {
      this.setState({ contacts: lsContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      save(KEY_CONTACTS, this.state.contacts);
    }
  }

  updateState = date => {
    if (this.state.contacts.some(el => el.name === date.name)) {
      toast.warn(`${date.name} is already in contacts.`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      // alert(`${date.name} is already in contacts.`);
    } else {
      this.setState(prevState => ({
        contacts: [
          { name: date.name, number: date.number, id: nanoid() },
          ...prevState.contacts,
        ],
      }));
    }
  };

  updateFilter = date => {
    this.setState({ filter: date });
  };

  filterByName = () => {
    const { contacts, filter } = this.state;
    const arr = contacts.filter(el =>
      el.name.toLowerCase().includes(filter.toLowerCase())
    );
    return arr;
  };

  deleteContact = id => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));
  };

  render() {
    const { contacts, filter } = this.state;
    return (
      <Container>
        <TitleForm>Phonebook</TitleForm>
        <ContactForm updateState={this.updateState} />

        {contacts.length === 0 ? (
          <Info>No contacts.</Info>
        ) : (
          <>
            <TitleContacts>Contacts</TitleContacts>
            <Filter state={filter} updateFilter={this.updateFilter} />
          </>
        )}

        {filter === '' ? (
          <ContactsList state={contacts} deleteContact={this.deleteContact} />
        ) : (
          <ContactsList
            state={this.filterByName()}
            deleteContact={this.deleteContact}
          />
        )}
        <ToastContainer/>
      </Container>
      
    );
  }
}

export default App;
