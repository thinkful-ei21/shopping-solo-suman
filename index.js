'use strict'; 
const STORE = {
  items :[
    {name: 'apples', checked: false, edit : false},
    {name: 'oranges', checked: false, edit : false},
    {name: 'milk', checked: true, edit : false},
    {name: 'bread', checked: false, edit : false}
  ],
  displayUnchecked : false, 
};


function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        ${item.edit?'<button class="shopping-item-edit-save js-item-edit-save"><span class="button-label">save</span></button>':
    '<button class="shopping-item-edit js-item-edit"><span class="button-label">edit</span></button>'}
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item, index));  
  return items.join('');
}


function renderShoppingList() {   
  let filterItems = [...STORE.items];
  if(STORE.displayUnchecked == true){    
    filterItems = filterItems.filter(item => item.checked == false);
    //console.log(filterItems);
  }  
  const shoppingListItemsString = generateShoppingItemsString(filterItems); 
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  //console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();    
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {    
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function removeItemFromShoppingList(itemIndex){  
  STORE.items.splice(itemIndex,1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click','.js-item-delete', event =>{
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    removeItemFromShoppingList(itemIndex);
    renderShoppingList();
  });  
}

function checkedItemDisplay(){    
  //console.log("got here");
  //STORE.displayUnchecked = STORE.displayUnchecked == false ? true : false; 
  $('.js-shopping-list-checked').on('change', function(event){
    STORE.displayUnchecked = STORE.displayUnchecked == false ? true : false;
    renderShoppingList();
  });
}


function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  checkedItemDisplay();
}

$(handleShoppingList);

