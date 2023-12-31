

// ///////////////////////////////////////////////////////////////////////////


let reset = document.querySelector('#reset')
let valBudget = document.querySelector('#valBudget');
const calculBuget = document.querySelector('#calculBuget');
budgetStatus = document.querySelector('#budgetStatus');
let balanceStatuts = document.querySelector('#balanceStatuts');
let expenseStatuts = document.querySelector('#expenseStatuts');
const notification = document.querySelector('#notification');
let boutHistory = document.querySelector('#boutHistory');
const history = document.querySelector('#history');
const closeHistory = document.querySelector('#boutCloseHistory');

let titleNotif = '';
let descriptionNotif = '';

/* --------------les fonctions ---------------------- */

//  information sur chaque depense
function ligneDepense(table) {
  infoDepense.innerHTML = '';
  table.forEach(element => {
    let tr = document.createElement('tr');
    // div.classList.add('d-flex', 'justify-content-between');
    tr.innerHTML = ` <td class="nomDepense">${element.nomProduit}</td>
                     <td class="valeurDepense">${element.valeurProduit} F</td>
                     <td> 
                      <a href="#" class="edit-icon mx-3" data-id = "${element.id}" >
                            <i class="fas fa-edit"></i>
                        </a>
                        <a href="#" class="delete-icon" data-id = "${element.id}">
                            <i class="fas fa-trash"></i>
                        </a>
                    </td>
                   `;
    infoDepense.append(tr);
  });
  setTableExpense();
}


// information sur sur l'historique

function ligneHistorique(table) {
  tabHistory.innerHTM = '';
  table.forEach(element => {
    let tr = document.createElement('tr');
    tr.innerHTML = `
                    <td>${element.id}</td>
                     <td class="nomDepense">${element.nomProduit}</td>
                     <td class="valeurDepense">${element.valeurProduit} F</td>
                     `;
    tabHistory.append(tr);
  });

}

// calcul de la valeur du budget

let totalBuget = 0;
let totalExpense = 0;
let totalBalance = 0;

if (!localStorage.getItem('budget')) {
  totalBuget = localStorage.setItem('budget', JSON.stringify(totalBuget));
}

if (!localStorage.getItem('balance')) {
  totalBalance = localStorage.setItem('balance', JSON.stringify(totalBalance));
}



if (!localStorage.getItem('expense')) {
  totalExpense = localStorage.setItem('expense', JSON.stringify(totalExpense))
}

function addBudget() {

  valeur = parseInt(valBudget.value);

  ///------------Gestion d'erreur

  if (!valeur || valeur < 0) {
    //  ------- notification -----------
    titleNotif = 'Ajout de budget';
    descriptionNotif = 'Votre budget doit être positif';
    notifError(titleNotif, descriptionNotif);

  } else {

    valBudget.value = '';

    totalBuget = JSON.parse(localStorage.getItem('budget')) + valeur;
    localStorage.setItem('budget', JSON.stringify(totalBuget));

    totalBalance = totalBuget - JSON.parse(localStorage.getItem('expense'));
    localStorage.setItem('balance', JSON.stringify(totalBalance));

    // console.log(getExpense());
    budgetStatus.innerHTML = `${getBudget()} F`;
    balanceStatuts.innerHTML = `${getBalance()} F`;

    //  ------- notification -----------
    titleNotif = 'Ajout de budget';
    descriptionNotif = 'Votre budget a été ajouté avec success';
    notifSuccess(titleNotif, descriptionNotif);
  }



}



function getBudget() { return JSON.parse(localStorage.getItem('budget')); }
function getBalance() { return JSON.parse(localStorage.getItem('balance')); }
function getExpense() { return JSON.parse(localStorage.getItem('expense')) }

//Afichage de l'historique au click boutton history

boutHistory.addEventListener('click', () => {
  history.classList.remove('hidden');
});

// fermeture de l'historique au click de boutton close

closeHistory.addEventListener('click', () => {
  history.classList.add('hidden');
})

/* -------------- calcul des depenses -------------------- */

let expenseTitle = document.querySelector('#expenseTitle');
let valeurDepense = document.querySelector('#valeurDepense');
let expenseValue = document.querySelector('#expenseValue');
const infoDepense = document.querySelector('.infoDepense')
const tabHistory = document.querySelector('#tabHistory');
let tableExpense = [];
//-------------- Dans le local l'index s'incremente et determine le nombre des produits stockés -------------------
//------------- chaque produit a son id à compter de 0 -------------------------------------------
let index = 0;
if (!localStorage.getItem('id')) {
  localStorage.setItem('id', JSON.stringify(index));
}


function getIndex() { return JSON.parse(localStorage.getItem('id')); }
index = getIndex();




function addExpense() {


  let valeurP = parseInt(expenseValue.value);

  //  console.log(infoDepense.children);

  //--------------Gestion d'erreur--------------

  if (!valeurP || valeurP < 0 || valeurP === '') {

    // ---------------------------------------notification --------------------------------------
    titleNotif = 'Ajout de la depense';
    descriptionNotif = 'Le montant de votre depense doit être positif';
    notifError(titleNotif, descriptionNotif);
    // -------------------------------------------------------------------------------------------
  } else {

    expenseValue.value = '';

    totalExpense = JSON.parse(localStorage.getItem('expense')) + valeurP;
    localStorage.setItem('expense', JSON.stringify(totalExpense));

    totalBalance = JSON.parse(localStorage.getItem('budget')) - JSON.parse(localStorage.getItem('expense'));
    localStorage.setItem('balance', JSON.stringify(totalBalance));


    balanceStatuts.innerHTML = `${getBalance()} F`
    expenseStatuts.innerHTML = `${getExpense()} F`
    /*---------------- Info sur la depense / titre et valeur de la depense -------------------*/

    const depense = {
      id: index,
      nomProduit: expenseTitle.value,
      valeurProduit: valeurP
    }

    if (tableExpense.length > 0) {
      const existP = tableExpense.find((produit) => produit.nomProduit === expenseTitle.value);
      if (existP) {
        tableExpense[existP.id]["valeurProduit"] += valeurP;
        console.log(tableExpense, existP);
      } else {
        tableExpense.push(depense);
        index++
        localStorage.setItem('id', JSON.stringify(index));
        // console.log(tableExpense, existP);
      }

    } else {
      tableExpense.push(depense)
      index++
      localStorage.setItem('id', JSON.stringify(index));
    }


    ligneDepense(tableExpense);

    //historique

    ligneHistorique(tableExpense)
    // console.log(ligneHistorique(tableExpense));
    expenseTitle.value = '';

    // -------------------------- notification --------------------------------------
    titleNotif = 'Ajout de la depense';
    descriptionNotif = 'votre depense a été ajoutée avec success';
    notifSuccess(titleNotif, descriptionNotif);
    // ----------------------------------------------------------------------------

  }

  setTimeout(() => {
    location.reload();
  }, 2500);

}




/* ----------------------chargement des dernères valeurs -------------------------- */




window.onload = () => {

  if (getBudget() !== null && getBalance() !== null && getExpense() !== null) {
    budgetStatus.innerHTML = `${getBudget()} F`;
    balanceStatuts.innerHTML = `${getBalance()} F`
    expenseStatuts.innerHTML = `${getExpense()} F`
  } else {
    budgetStatus.innerHTML = `${0} F`;
    balanceStatuts.innerHTML = `${0} F`
    expenseStatuts.innerHTML = `${0} F`
  }

}



//


/* -------------- Rénialisation de localstorage ---------------- */
function reinitialise() {
  localStorage.clear();
  budgetStatus.textContent = `${0} F`;
  balanceStatuts.textContent = `${0} F`;
  expenseStatuts.textContent = `${0} F`;
  tableExpense = [];
  ligneDepense(tableExpense)
  location.reload();
}





function setTableExpense() {
  localStorage.setItem('listExpense', JSON.stringify(tableExpense));
}


function getTableExpense() {
  if (localStorage.getItem('listExpense')) {
    tableExpense = JSON.parse(localStorage.getItem('listExpense'));
    // console.log(tableExpense);
    ligneDepense(tableExpense);
    ligneHistorique(tableExpense);
  }
}
getTableExpense();


//------------------ Modification des produits ---------------------------------

// console.log(tableExpense);
const editBtn = document.querySelectorAll('.edit-icon');
// console.log(editBtn);
editBtn.forEach(button => {
  button.addEventListener('click', () => {
    let tabExpenseCopy = [...tableExpense];
    console.log(tabExpenseCopy, button.dataset.id, tableExpense[button.dataset.id]);
    // console.log(tableExpense, button.dataset.id, tableExpense[button.dataset.id]);
    let parent = button.parentNode.parentNode;
    // parent.remove();

    expenseTitle.value = tableExpense[button.dataset.id].nomProduit;
    expenseValue.value = tableExpense[button.dataset.id].valeurProduit;


    
    // let newTotalEpexpense = getExpense() - tableExpense[button.dataset.id].valeurProduit;
    // let newBalance = getBalance() + tableExpense[button.dataset.id].valeurProduit;
    // tableExpense.splice(button.dataset.id, 1);
    // totalBalance = localStorage.setItem('balance', newBalance);
    // totalExpense = localStorage.setItem('expense', newTotalEpexpense);
    // expenseStatuts.textContent = `${getExpense()}`;
    // balanceStatuts.textContent = `${getBalance()}`;
    // setTableExpense();
    //------- Décrementation du nombres des id ---------------
    // index--;
    // localStorage.setItem('id', JSON.stringify(index));
    // console.log(getIndex());
  })

})


//-------------- Supprission des produits --------------------

const deleteBtn = document.querySelectorAll('.delete-icon');
// console.log(deleteBtn);

deleteBtn.forEach(button => {
  button.addEventListener('click', () => {
    console.log(tableExpense, button.dataset.id, tableExpense[button.dataset.id]);
    let parent = button.parentNode.parentNode;
    parent.remove();

    let newTotalEpexpense = getExpense() - tableExpense[button.dataset.id].valeurProduit;
    let newBalance = getBalance() + tableExpense[button.dataset.id].valeurProduit;
    tableExpense.splice(button.dataset.id, 1);
    totalBalance = localStorage.setItem('balance', newBalance);
    totalExpense = localStorage.setItem('expense', newTotalEpexpense);
    expenseStatuts.textContent = `${getExpense()}`
    balanceStatuts.textContent = `${getBalance()}`
    setTableExpense();

    //------- Décrementation du nombres des id ---------------
    index--;
    localStorage.setItem('id', JSON.stringify(index));
    console.log(getIndex());
    location.reload()

  })
})




///------------------le graphe -------------------
//--------les tableaux des données--------------
let labelChart = [];
let dataChart = [];

tableExpense.forEach(element => {
  // console.log(element);
  // console.log(element.valeurProduit);

  dataChart.push(element.valeurProduit);
  labelChart.push(element.nomProduit);

});
// console.log(labelChart, dataChart);
// ==================================================
const ctx = document.getElementById('myChart');

let config = {
  type: 'doughnut',
  data: {
    labels: labelChart,
    datasets: [{
      label: labelChart, //'# of Votes',
      data: dataChart,  //[12, 19, 3, 5, 2, 3
      borderWidth: 1
    }]
  },
  options: {

    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        display: false,
      }
    }
  }
};
let graphe = new Chart(ctx, config);



// ==================================================



// ================= FONCTIONS POUR LES NOTIFICATIONS  ================

// ---------notification pour les operations de succès ---------------------
function notifSuccess(titre, descprition) {

  notification.classList.remove('hidden');
  notification.children[0].textContent = titre;
  notification.children[1].textContent = descprition;

  setTimeout(() => {
    notification.classList.add('hidden');
    titleNotif = '';
    descriptionNotif = '';
  }, 1500);
}

// --------- notification pour les erreus  ---------------------
function notifError(titre, descprition) {

  notification.classList.remove('hidden');
  notification.children[0].classList.add('bg-danger');
  notification.children[0].textContent = titre;
  notification.children[1].textContent = descprition;
  notification.children[1].classList.add('text-danger');
  notification.classList.add('border-danger');
  setTimeout(() => {
    notification.classList.add('hidden');
    titleNotif = '';
    descriptionNotif = '';
  }, 1500);
}






// ==========================================
function controlerSaisie(valeurAutoriser) {
  // Récupérer la valeur saisie
  // var champInput = document.getElementById('monInput');
  // var valeurSaisie = champInput.value;
   valeurAutoriser = inputExpenseTitle.value;
  // Validation (ex. : seulement des lettres autorisées)
  let caracteresAutorises = /^[a-zA-Z]+$/;

  if (!caracteresAutorises.test(valeurAutoriser)) {
      // Afficher un message d'erreur
alert('stop')
      // Bloquer la saisie du dernier caractère
      valeurAutoriser  = inputExpenseTitle.value.slice(0, -1);
  } else {
      // Effacer le message d'erreur si la saisie est valide
      // document.getElementById('messageErreur').innerText = '';
      alert('continuez')
  }
}