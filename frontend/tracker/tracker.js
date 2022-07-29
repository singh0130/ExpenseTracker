const token= localStorage.getItem('token');
function addNewExpense(e)
{
    e.preventDefault();
    
    const amount= document.getElementById('amount');
    const description= document.getElementById('description');
    const category= document.getElementById('category');

    const expenseDetails= {
        amount: amount.value,
        description: description.value,
        category: category.value
    }

    const token= localStorage.getItem('token');

    axios.post('https://localhost:3000/addexpenses', expenseDetails, {headers: {'Authorization': token}})
    .then((res) => {
        if(res.status===201)
        {
            addExpense(res.data.expense);
        }
    })
    .catch(err => alert(err.response.data.message));
}

window.addEventListener('load', () => {
    const userDetails_JSON= localStorage.getItem('userDetails');
    const userDetails= JSON.parse(userDetails_JSON);

    if(userDetails.isPremium===true)
    {
        document.getElementById('premium').remove();
    }

    axios.get('https://localhost:3000/getexpense', {headers: {'Authorization': token}})
    .then(res => {
        if(res.status===200)
        {
            res.data.expenses.forEach(expense => {
                addExpense(expense);
            })
        }
    })
    .catch(err => console.log(err));
});

function addExpense(expense)
{
    const parent= document.getElementById('list');
    const liElementId= `${expense.expenseId}`;
    parent.innerHTML+= `<tr id="${liElementId}">
                            <td>${expense.category}</td><td>${expense.description}</td><td>${expense.amount}</td>
                            <td><button id="delete" onclick="deleteNewExpense(event, ${expense.expenseId})"></button></td>
                        </tr>`
}

function deleteNewExpense(e, expenseId)
{
    
    axios.delete(`https://localhost:3000/deleteexpense/${expenseId}`, {headers: {"Authorization": token}})
    .then(res => {
        if(res.status===201)
        {
            deleteExpense(expenseId);
        }
    })
    .catch();
}

function deleteExpense(expenseId)
{
    document.getElementById(expenseId).remove();
}

function logout()
{
    localStorage.clear();
    window.location.href= '../login/login.html';
}

function download()
{
    const userDetails_JSON= localStorage.getItem('userDetails');
    const userDetails= JSON.parse(userDetails_JSON);
    if(userDetails.isPremium===true)
    {
        axios.get('https://localhost:3000/download', {headers: {"Authorization": token}})
        .then((response) => {
            if(response.status===201)
            {
                var a= document.createElement("a");
                a.href= response.data.fileUrl;
                a.download= 'myexpense.csv';
                a.click();
            }
            else 
            {
                throw new Error(response.data.message);
            }
        })
        .catch((err) => {
            console.log(err.response);
        });
    }
}

async function toPremium(e)
{
    
    const response= await axios.get('https://localhost:3000/premiummembership', {headers: {"Authorization": token}});
    var options= {
        "key": response.data.key_id,
        "name": "Test Company",
        "order_id": response.data.order.id,
        "prefill": {
            "name": "Test User",
            "email": "test.user@example.com",
            "contact": "9399848032"
        },
        "theme": {
            "color": "#3399cc"
        },
        "handler": function (response) {
            axios.post('https://localhost:3000/updatetransaction', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, {headers: {"Authorization": token}})
            .then(() => {
                alert('You are a Premium User now');
            })
            .catch(() => {
                alert('Something went Wrong! Try again!');
            });
        }
    }

    const rzp1= new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        alert(response.error.description);
    });
}