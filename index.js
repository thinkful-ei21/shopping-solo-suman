'use strict'; 
const STORE = {
  items :[
    {name: 'apples', checked: false, edit : false},
    {name: 'oranges', checked: false, edit : false},
    {name: 'milk', checked: true, edit : false},
    {name: 'bread', checked: false, edit : false},
  ],
  displayUnchecked : false, 
  searchItem :'',
};

function generateSpanElement(item){
  //if edit is true make it a text box and allow user to edit
  if(item.edit){
    return `<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">
      <input type="text" id="js-shopping-item-edit" value="${item.name}">
    </span>`;
  }
  else{
    //if the edit button is not cicked let it be a span element
    return `<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>`;
  }  
}

//getting rid of save button ('ENTER' will save the item name on form submit) --- update -- didn't work.. adding save button back
function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      ${generateSpanElement(item)}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        ${item.edit?'<button class="shopping-item-save js-item-save"><span class="button-label">save</span></button>':
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
  }  
  if(STORE.searchItem !== ''){    
    filterItems = filterItems.filter(item => item.name == STORE.searchItem);    
  }
  const shoppingListItemsString = generateShoppingItemsString(filterItems); 
  $('.js-shopping-list').html(shoppingListItemsString);  
}

function addItemToShoppingList(itemName) {  
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
  $('.js-shopping-list-checked').on('change', function(event){
    STORE.displayUnchecked = STORE.displayUnchecked == false ? true : false;
    renderShoppingList();
  });
}

function filterSearchTerm(){
  $('.js-search-button').on('click', event=> {    
    event.preventDefault();
    const itemName = $('.js-shopping-list-search').val();    
    STORE.searchItem = itemName;    
    renderShoppingList();
    $('.js-shopping-list-search').val('');
  });
}

function editAnItem(){  
  $('.js-shopping-list').on('click','.js-item-edit', event=>{     
    event.preventDefault();               
    const itemIndex = getItemIndexFromElement(event.currentTarget);        
    STORE.items[itemIndex].edit = !STORE.items[itemIndex].edit;
    // STORE.items = STORE.items.map(item => {
    //   if(item.index === itemIndex)
    //     item.edit = true;        
    // });           
    renderShoppingList();     
    updateItem(); //check why the save event doesn't fire if updateItem() is not called from here. 
  });    
}

function updateItem(){
  $('.js-item-save').on('click', event => {      
    event.preventDefault();            
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.items[itemIndex].name = $('#js-shopping-item-edit').val();    
    STORE.items[itemIndex].edit = false;
    STORE.items[itemIndex].checked = false; // assuming that if the user is editing it , he doesn't want it checked.
    renderShoppingList();    
    //see why hitting enter doesn't save the updated item name later
  });
}


function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  checkedItemDisplay();
  filterSearchTerm();
  editAnItem();  
  updateItem();
}

$(handleShoppingList);

