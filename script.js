const pokemonForm = document.forms.idPokemonForm;
const pokemonResults = document.querySelector('.add-pokemon');
let editing = false;
let currentEditing = null;
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const createPokemon = (idPokemon, namePokemon, imgPokemon) => {
  const li = document.createElement('li');

  const img = document.createElement('img');
  img.src = imgPokemon;
  img.alt = `Imagen de ${namePokemon}`

  const span = document.createElement('span');
  span.innerText = `${idPokemon} - ${namePokemon}`;

  const editBtn = document.createElement('button');
  editBtn.innerText = 'Edit';
  editBtn.classList.add('edit');
  editBtn.addEventListener('click', () => editPokemon(li, span));

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Delete';
  deleteBtn.classList.add('delete');
  deleteBtn.addEventListener('click', () => deletePokemon(li));

  li.appendChild(img);
  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
};

const addPokemon = (idPokemon) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
    .then(response => {
      if (!response.ok) {
        alert('Ese pokemon no existe, hermano!');
      }
      return response.json();
    })
    .then(data => {
      const pokemonName = capitalizeFirstLetter(data.name);
      const pokemonImg = data.sprites.front_default;

      if (pokemonExist(idPokemon, pokemonName)) {
        alert('Ese Pokémon ya esta en la lista, brou!');
        resetForm();
        return;
      }

      const newPokemon = createPokemon(idPokemon, pokemonName, pokemonImg);
      pokemonResults.appendChild(newPokemon);
      resetForm();
    })
    .catch(error => {
      return;
    });
};

const pokemonExist = (idPokemon, namePokemon) => {
  const allPokemon = pokemonResults.querySelectorAll('li span');
  for (const pokemon of allPokemon) {
    const [pokeId, pokeName] = pokemon.innerText.split(' - ');
    if (pokeId === idPokemon || pokeName.toLowerCase() === namePokemon.toLowerCase()) {
      return true;
    }
  }
  return false;
};

const editPokemon = (li, span) => {
  const [id, name] = span.innerText.split(' - ');
  document.getElementById('idPokemon').value = id;
  editing = true;
  currentEditing = {li, span};
  pokemonForm.querySelector('input[type="submit"]').value = 'Editar Pokémon'; 
};

const updatePokemon = (idPokemon) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
    .then(response => {
      if (!response.ok) {
        alert('El ID de ese pokemon no esta registrado, mi hermanazo');
      }
      return response.json();
    })
    .then(data => {
      const pokemonName = capitalizeFirstLetter(data.name);
      const pokemonImg = data.sprites.front_default;
      if (pokemonExist(idPokemon, pokemonName)) {
        alert('Ese Pokémon ya existe en la lista, brother!');
        resetForm();
        return;
      }

      currentEditing.span.innerText = `${idPokemon} - ${pokemonName}`;
      currentEditing.li.querySelector('img').src = pokemonImg;
      resetForm();
    })
    .catch(error => {
      return;
    });
};

const resetForm = () => {
  document.getElementById('idPokemon').value = '';
  editing = false;
  currentEditing = null;
  pokemonForm.querySelector('input[type="submit"]').value = 'Buscar Pokemon';
};

const deletePokemon = (li) => {
  if (confirm('Estas seguro que ya no queres al pobre e indefenso Pokemon?? Va a ser tirado al bosque y con suerte sobrevivira más de 3 días, piensalo, mirale los ojitos, necesita un hogar')){
    li.remove();
  }
};

pokemonForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputs = pokemonForm.elements;
  const idPokemon = inputs['idPokemon'];

  if (idPokemon.value.trim() !== '') 
  {
    if (editing) {
      updatePokemon(idPokemon.value);
    } 
    else
    {
      addPokemon(idPokemon.value);
    }
  }
  else
  {
    alert('Ingrese el ID de un pokemon porfavorsito');
  }
});