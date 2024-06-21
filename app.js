let editingIndex = -1;

    document.getElementById('add').addEventListener('click', async () => {
    const description = document.getElementById('expenseInput').value;
    const quantity = document.getElementById('expenseQuantity').value;
    const amount = document.getElementById('expenseValue').value;
    const currencyFrom = document.getElementById('originCurrency').value;
    const currencyTo = document.getElementById('exchangedCurrency').value;

    if (!description || !quantity || !amount) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currencyFrom}`);
    const data = await response.json();
    const rate = data.rates[currencyTo];
    const convertedAmount = ((quantity*amount) * rate).toFixed(2);

    const expense = {
        description,
        quantity: parseFloat(quantity),
        amount: parseFloat(amount),
        currencyFrom,
        currencyTo,
        convertedAmount: parseFloat(convertedAmount)
    };

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    if (editingIndex === -1) {
        expenses.push(expense);
    } else {
        expenses[editingIndex] = expense;
        editingIndex = -1;
    }

    localStorage.setItem('expenses', JSON.stringify(expenses));

    clearForm();
    displayExpenses();
});

function clearForm() {
    document.getElementById('expenseInput').value = '';
    document.getElementById('expenseQuantity').value = '';
    document.getElementById('expenseValue').value = '';
    document.getElementById('originCurrency').value = 'BRL';
    document.getElementById('exchangedCurrency').value = 'BRL';
}

function displayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseList = document.getElementById('expensesList');
    expenseList.innerHTML = '';
    let totalOrigin = 0;
    let totalDestination = 0;

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.classList.add('row');
        li.classList.add('display-flex-important');

        const textDiv = document.createElement('textDiv');
        textDiv.classList.add('col-md-4');
        const textSpan = document.createElement('span');
        textSpan.textContent = `${expense.description} (Qtd. ${expense.quantity}): ${expense.amount} ${expense.currencyFrom} => ${expense.convertedAmount} ${expense.currencyTo}`;

        textDiv.appendChild(textSpan);

        const editDiv = document.createElement('div');
        editDiv.classList.add('col-md-4');
        const editButton = document.createElement('button');
        editButton.classList.add('btn');
        editButton.classList.add('btn-primary');
        editButton.onclick = () => {
            editExpense(index);
        };

        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-pencil-alt');

        editButton.appendChild(editIcon);

        editDiv.appendChild(editButton);


        const removeDiv = document.createElement('div');
        removeDiv.classList.add('col-md-4');
        const removeButton = document.createElement('button');
        removeButton.classList.add('btn');
        removeButton.classList.add('btn-danger');
        removeButton.onclick = () => {
            removeExpense(index);
        };

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fas', 'fa-trash');

        removeButton.appendChild(trashIcon);

        removeDiv.appendChild(removeButton);


        li.appendChild(textDiv);
        li.appendChild(editDiv);
        li.appendChild(removeDiv);
        expenseList.appendChild(li);

        totalOrigin += (expense.amount*expense.quantity);
        totalDestination += expense.convertedAmount;
    });

    document.getElementById('expensesTotalOrigin').textContent = totalOrigin.toFixed(2);
    document.getElementById('expensesTotalExchanged').textContent = totalDestination.toFixed(2);
}

function editExpense(index) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses[index];
    document.getElementById('expenseInput').value = expense.description;
    document.getElementById('expenseQuantity').value = expense.quantity;
    document.getElementById('expenseValue').value = expense.amount;
    document.getElementById('originCurrency').value = expense.currencyFrom;
    document.getElementById('exchangedCurrency').value = expense.currencyTo;

    editingIndex = index;
}

function removeExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
}

window.onload = displayExpenses;
document.addEventListener('DOMContentLoaded', displayExpenses);
