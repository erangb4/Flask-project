var x = {}

function add_customer() {

    customer = {
        name: $('#txt_name').val(),
        address: $('#txt_address').val(),
    }
    console.log(customer)
    $.ajax({
            type: "POST",
            url: "/customers",
            data: JSON.stringify(customer),
            dataType: "JSON",
            contentType: 'application/json',
            success: function(data, status){
                if (data.hasOwnProperty('status')){
                    if (data.hasOwnProperty('reason')){
                        alert('Update failed, please check all update fields are filled')
                        return
                    } }
                console.log('status', status)
                console.log('data', data)
                get_all_customers(true)
            },
            error: function (xhr, desc, err) {
            }
            });

}
function get_customer_by_id() {
     $.ajax({url:"/customers/" + parseInt($('#get_id').val())}).then(
      function(one_customer) // after-promise succeed
                {
                    if (Object.keys(one_customer).length === 0){
                        console.log('not exists');
                        alert("Customer not exists in the DB");
                        return
                    }
                    console.log(one_customer);
                    var customers_table =  $("#customers"); //ca
                    customers_table.find("tr:gt(0)").remove();
                    customers_table.append(
                        `<tr><td>${one_customer.id}</td>
                             <td>${one_customer.name}</td>
                             <td>${one_customer.address}</td>
                             <td><button style="color:red" onclick="delete_customer(${one_customer.id})">X</button></td></tr>`);


                }
                ,function(err)   // after-promise failed
                {
                    console.log(err);}
                );

}

function update_customer() {
    customer = {
        id: parseInt($('#update_id').val()),
        name: $('#update_name').val(),
        address: $('#update_address').val(),
    }
    console.log(customer)

    $.ajax({
        type: "PUT",
        url: "customers/" + customer.id,
        data: JSON.stringify(customer),
        dataType: "JSON",
        contentType: 'application/json',
        success: function(data, status){
            console.log('status', status)
            console.log('data', data)
            if (data.hasOwnProperty('status')){
                if (data.hasOwnProperty('reason')){
                    alert('Update failed, please check all update fields are filled')
                    return
                }
                alert('Update failed, customer id not exists in the db')
                return
            }
            get_all_customers(false)
        },
        error: function (xhr, desc, err) {
        }
});
}

function delete_customer(id) {
    console.log(`send ajax to delete where customer id = ${id}`)

    // delete the customer
    $.ajax({
            type: "DELETE",
            url: "/customers/" + id,
            success: function(data, status){
                console.log('status', status)
                console.log('data', data)
                get_all_customers(false)
            },
            error: function (xhr, desc, err) {
            }
            });
}

function get_all_customers(draw_last_only) {
        var customers_table =  $("#customers"); //cache

        if (!draw_last_only)
            customers_table.find("tr:gt(0)").remove();

        $.ajax({url:"/customers"}).then(
                function(_customers) // after-promise succeed
                {
                x.result = _customers
                    console.log(_customers);
                    console.log(_customers[0])

                   $.each(_customers,  (i, customer) => {
                            if (!draw_last_only || i == _customers.length - 1) {
                                customers_table.append(
                                    `<tr><td>${customer.id}</td>
                                         <td>${customer.name}</td>
                                         <td>${customer.address}</td>
                                         <td><button style="color:red" onclick="delete_customer(${customer.id})">X</button></td></tr>`)
                                         };
                    })
                }
                ,function(err)   // after-promise failed
                {
                    console.log(err);}
                );
}

$(document).ready(function()
{
    $('#btn1').on('click', () => {

        get_all_customers(false);

    });


});
$(document).ready(function()
{
    $('#btn2').on('click', () => {

        get_customer_by_id();

    });


});
