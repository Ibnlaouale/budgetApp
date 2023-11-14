//============== RECUPERATION DES INPUT ===========================
const inputBudget = document.querySelector('#valBudget');
const inputExpenseTitle = document.querySelector('#expenseTitle');
const inputExpenseAmount = document.querySelector('#expenseValue');

// =========RECUPERATION DES BUTTONS ==============================

const buttonCalculate = document.querySelector('#calculBuget');
const buttonAddExpense = document.querySelector('#addExpense');
const buttonUpdateExpense = document.querySelector('#updateExpense');
const buttonReset = document.querySelector('#reset');
const buttonHistory = document.querySelector('#boutHistory');
const buttonCloseHistory = document.querySelector('#boutCloseHistory');

// ================= RECUPERATIO DE LA DIV HISTORY ================
const divHistory = document.querySelector('#history');
//==============RECUPERATION DES STATUS DES VALEURS ===============

const budgetStatus = document.querySelector('#budgetStatus');
const expenseStatus = document.querySelector('#expenseStatuts');
const balanceStatuts = document.querySelector('#balanceStatuts');

// =====================================================================================
// =====================================================================================


// =============INTIALISATION DE LOCALSTORAGE =====================

if (!localStorage.getItem('tableExpense')) {
  localStorage.setItem('tableExpense', JSON.stringify([]));
}
if (!localStorage.getItem('budget')) {
  localStorage.setItem('budget', 0);
}


if (!localStorage.getItem('expense')) {
  localStorage.setItem('expense', 0);
}


if (!localStorage.getItem('balance')) {
  localStorage.setItem('balance', 0);
}


if (!localStorage.getItem('id')) {
  localStorage.setItem('id', 1);
}




let totalBudget = JSON.parse(localStorage.getItem('budget'));
let totalExpense = JSON.parse(localStorage.getItem('expense'));
let totalBalance = JSON.parse(localStorage.getItem('balance'));
let tableExpense = JSON.parse(localStorage.getItem('tableExpense'));
let index = JSON.parse(localStorage.getItem('id'));
// =============FONCTION DE MISE A JOUR DE LOCALSTORAGE =================

function updateLocalStorage() {
  localStorage.setItem('budget', JSON.stringify(totalBudget));
  localStorage.setItem('expense', JSON.stringify(totalExpense));
  localStorage.setItem('balance', JSON.stringify(totalBalance));
  localStorage.setItem('tableExpense', JSON.stringify(tableExpense));
  localStorage.setItem('id', JSON.stringify(index));
}

// ================ REINITIALISATION DE LOCALSTORAGE =================

function reinitialise() {
  localStorage.clear();
  showStatus();
  tableExpense = [];
  location.reload();
}

// =====================================================================================
// ============= FONNCTION POUR LES CALCULS DE BUDGET , BALANCE  ========================

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

    totalBudget += valeur;
    totalBalance = totalBudget - totalExpense;
    updateLocalStorage();
    showStatus();

    //  ------- notification -----------
    titleNotif = 'Ajout de budget';
    descriptionNotif = 'Votre budget a été ajouté avec success';
    notifSuccess(titleNotif, descriptionNotif);
  }



}


function addExpense() {
  

// ============================================================
  let productTitle =  (inputExpenseTitle.value).trim();
  let productAmount = parseInt(inputExpenseAmount.value);

    totalExpense += productAmount;
    totalBalance = totalBudget - totalExpense;
    // =====Appel de la fonction qui affiche l'etats des resultats =======
    showStatus();
    // =====Appel de la fonction qui cree les depenses =======
    createExpense(productTitle, productAmount);
    inputExpenseTitle.value = '';
    inputExpenseAmount.value = '';

    setTimeout(() => {
      location.reload();
    }, 2500);
 

}












// ===================== CHARGEMENT DES DERNIERES VALEURS SUR DOM ============

window.onload = () => {
  showStatus();
}
// ==============================================================
let infoDepense = document.querySelector('.infoDepense');
function ligneDepense() {
  infoDepense.innerHTML = '';
  tableExpense.forEach((element, index) => {
    // let tr = document.createElement('tr');
    infoDepense.innerHTML += `
                    <tr>
                    <td class="nomDepense">${element.nomProduit}</td>
                     <td class="valeurDepense">${element.valeurProduit} F</td>
                     <td> 
                      <a href="#" onclick="editExpense(${index})" class="edit-icon mx-3" data-id = "${element.id}" >
                            <i class="fas fa-edit"></i>
                        </a>
                        <a href="#" onclick="deleteExpense(${index})" class="delete-icon" data-id = "${element.id}">
                            <i class="fas fa-trash"></i>
                        </a>
                    </td>
                    </tr>
                   `;
  });
}


// ============ information sur sur l'historique

function ligneHistorique() {
  tabHistory.innerHTML = '';
  tableExpense.forEach((element, index) => {
    let tr = document.createElement('tr');
    tabHistory.innerHTML += `<tr>
                    <td>${index + 1}</td>
                     <td class="nomDepense">${element.nomProduit}</td>
                     <td class="valeurDepense">${element.valeurProduit} F</td>
                     </tr>
                     `;
  });
}


buttonHistory.addEventListener('click', () => {
  divHistory.classList.remove('hidden');
});

//=== fermeture de l'historique au click de boutton close

buttonCloseHistory.addEventListener('click', () => {
  divHistory.classList.add('hidden');
})
// ======================================================
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

// ================================================================

// ================ FONCTION POUR LA CREATION DES DEPENSES ================

// console.log(tableExpense);



function createExpense(titleExpense, valueExpense) {

  // ========== GESTION D'ERREURS ====================

  if (titleExpense === '' && valueExpense === '') {
    // ---------------------------------------notification --------------
    titleNotif = 'Ajout de la depense';
    descriptionNotif = 'veuillez renseigner la depense';
    notifError(titleNotif, descriptionNotif);
    return;
    // -----------------------------------------------------------------------------

  } else if (titleExpense === '') {
    // ---------------------------------------notification --------------
    titleNotif = 'Ajout de la depense';
    descriptionNotif = 'veuillez renseigner la depense';
    notifError(titleNotif, descriptionNotif);
    return;
    // -----------------------------------------------------------------------------
  } else if (!valueExpense || valueExpense < 0 || valueExpense === '') {

    // ---------------------------------------notification ---------------------------
    titleNotif = 'Ajout de la depense';
    descriptionNotif = 'Le montant de votre depense doit être positif';
    notifError(titleNotif, descriptionNotif);
    return;
    // ===============================================================================
  } else {

    const depense = {
      id: index,
      nomProduit: titleExpense.toLowerCase(),
      valeurProduit: valueExpense
    };
    index++;

    // ---------------- verification de l'existence de produit dans tableEexpense-------
    const existP = tableExpense.find((produit) => (produit.nomProduit) === titleExpense.toLowerCase());
    if (existP) {

      console.log(true);
      existP.valeurProduit += valueExpense;

      // ---------------------------------------notification --------------------------------------
      titleNotif = 'Mise à jour de la depense';
      descriptionNotif = 'Depense mis à jour avec succès';
      notifSuccess(titleNotif, descriptionNotif);
      // -------------------------------------------------------------------------------------------
      console.log(existP);
      updateLocalStorage();

    } else {
      tableExpense.push(depense);
      // -------------------------- notification --------------------------------------
      titleNotif = 'Ajout de la depense';
      descriptionNotif = 'votre depense a été ajoutée avec success';
      notifSuccess(titleNotif, descriptionNotif);
      // ----------------------------------------------------------------------------
      updateLocalStorage();
    }
    // calculateTotalExpense()
    console.log(tableExpense);
  }
  showStatus();
}



function showStatus() {
  budgetStatus.innerHTML = `${totalBudget} F`;
  balanceStatuts.innerHTML = `${totalBalance} F`;
  expenseStatus.innerHTML = `${totalExpense} F`;
  ligneDepense();
  ligneHistorique();
}



///==============LE GRAPHE DE LA CHART JS ==============
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

function showChart() {
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
  return graphe;

}
// =================== APPEL DE LA FONCTION SHOWSART ================
showChart();
// ===================================================================


//==================== SUPPRESSION DES PRODUITS  ===========================

function deleteExpense(index) {
  let depense = tableExpense[index];
  console.log(depense.valeurProduit);
  totalExpense -= depense.valeurProduit;
  totalBalance = totalBudget - totalExpense;
  tableExpense.splice(index, 1);
  updateLocalStorage();
  showStatus();
  location.reload();
}





// let tableExpenseCopy = [...tableExpense];
let updateIndex = -1;
let oldPrice = 0;
function editExpense(index) {
  console.log(index);
  updateIndex = index;
  // console.log('updateIndex', updateIndex);
  // isChecked = true;
  // console.log('sorite du check', isChecked);
  buttonAddExpense.classList.add('d-none');
  buttonUpdateExpense.classList.remove('d-none');

  let expenseToEdit = tableExpense[index];
  inputExpenseTitle.value = expenseToEdit.nomProduit;
  inputExpenseAmount.value = expenseToEdit.valeurProduit;
  oldPrice = parseInt(inputExpenseAmount.value);

  //  tableExpense.splice(index, 1);

}
buttonUpdateExpense.addEventListener('click', () => {
  updateExpense(inputExpenseTitle.value.trim(), inputExpenseAmount.value, updateIndex, oldPrice)
inputExpenseTitle.value = '';
inputExpenseAmount.value = '';
})
/* console.log(oldPrice);
console.log(totalBalance);
console.log(totalExpense);
console.log(totalBudget); */
function updateExpense(title, value, index, oldPrice) {

  if (title.trim() === '' && value === '') {
    // ---------------------------------------notification --------------
    titleNotif = 'Ajout de la depense';
    descriptionNotif = 'veuillez renseigner la depense';
    notifError(titleNotif, descriptionNotif);
    return;
    // --------------------------------------------------------------------

  }
// =========================================================================
  let updateTitle = title.trim().toLowerCase();
  let updateValue = parseInt(value);
  let updateIndex = index;
  /* console.log(updateTitle);
  console.log(updateValue);
  console.log(updateIndex); */
  console.log("=================================");
  if (updateTitle === tableExpense[index].nomProduit) {
    if (updateValue != tableExpense[index].valeurProduit) {
      tableExpense[index].valeurProduit = updateValue;
      // console.log('30 oldprice : ',oldPrice);
      totalExpense -= oldPrice;
      totalBalance = totalBalance + oldPrice;
      // console.log('60 totalBalance : ', totalBalance);
      // console.log('40 totalExpense - oldPrice',totalExpense);
      totalExpense += updateValue;
      // console.log('75 totalExpense + updateValue', totalExpense);
      totalBalance = totalBudget - totalExpense;
      // console.log('25 totalBalance', totalBalance); 
      updateLocalStorage();
      // ---------------------------------------notification --------------------------------------
      titleNotif = 'Mise à jour de la depense';
      descriptionNotif = 'Depense mis à jour avec succès';
      notifSuccess(titleNotif, descriptionNotif);
      // -------------------------------------------------------------------------------------------
      showStatus();
      showChart();
    }

  } else {
    totalExpense -= oldPrice;
    totalBalance = totalBalance + oldPrice;
    totalExpense += updateValue;
    totalBalance = totalBudget - totalExpense;

    const existP = tableExpense.find((produit) => (produit.nomProduit) === updateTitle.toLowerCase());
    if (existP) {

      existP.valeurProduit += updateValue;
      console.log(existP);
      tableExpense.splice(index,1);
      // ---------------------------------------notification --------------------------------------
      titleNotif = 'Mise à jour de la depense';
      descriptionNotif = 'Depense mis à jour avec succès';
      notifSuccess(titleNotif, descriptionNotif);
      // -------------------------------------------------------------------------------------------
      updateLocalStorage();

    } else{
      
      tableExpense[index].nomProduit = updateTitle;
      tableExpense[index].valeurProduit = updateValue;
      // ---------------------------------------notification --------------------------------------
      titleNotif = 'Mise à jour de la depense';
      descriptionNotif = 'Depense mis à jour avec succès';
      notifSuccess(titleNotif, descriptionNotif);
      // -------------------------------------------------------------------------------------------
      updateLocalStorage();
      showStatus();
      showChart();
    }

  }
}
