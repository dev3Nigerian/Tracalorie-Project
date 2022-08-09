// Storage COntroller
const StorageCtrl = (function () {
  // Public methods
  return {
    storeItem: function (item) {
      let items;
      // Check if any items in ls
      if (localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));

        // Push new Item
        items.push(item);

        // Reset ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: (id) => {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();
// Item Controller
const ItemCtrl = (function () {
  class Item {
    constructor(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
  }

  // Data Structure / State
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookies', calories: 400},
    //   // {id: 2, name: 'Big Mac', calories: 800}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function () {
      return data.items
    },
    addItem: (name, calories) => {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new Item
      newItem = new Item(ID, name, calories)

      // Add to items array
      data.items.push(newItem);

      return newItem;

    },
    getItemById: (id) => {
      let found = null;
      // loop through items
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: (name, calories) => {

      // Calories to number 
      calories = parseInt(calories);

      let found = null;

      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function () {
      // Get ids
      const ids = data.items.map((item) => {
        return item.id;
      });

      // Get index 
      const index = data.items.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;

      // loop through items and add cals
      data.items.forEach((item) => {
        total += item.calories;
      });

      // Set total cal in data structure
      data.totalCalories = total;

      // return total
      return data.totalCalories;
    },
    logData: function () {
      return data;
    }
  }

})();


// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addMeal: '.add-btn',
    updateMeal: '.update-btn',
    deleteMeal: '.delete-btn',
    back: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  }

  //Public methods
  return {
    populateItemList: (items) => {
      let html = '';

      items.forEach((item) => {
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>
        `
      });

      // Insert List items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function (item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item.${item.id}`;
      // Add html
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // Insert item to DOM
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List into an array
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    ClearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into an array
      listItems = Array.from(listItems);

      listItems.forEach((item) => {
        item.remove();
      })

    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function (total) {
      document.querySelector(UISelectors.totalCalories).textContent = total
    },
    clearEditState: function () {
      UICtrl.ClearInput();
      document.querySelector(UISelectors.updateMeal).style.display = 'none';
      document.querySelector(UISelectors.deleteMeal).style.display = 'none';
      document.querySelector(UISelectors.back).style.display = 'none';
      document.querySelector(UISelectors.addMeal).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateMeal).style.display = 'inline';
      document.querySelector(UISelectors.deleteMeal).style.display = 'inline';
      document.querySelector(UISelectors.back).style.display = 'inline';
      document.querySelector(UISelectors.addMeal).style.display = 'none';
    },
    getSelectors: function () {
      return UISelectors
    }
  }
})();


// App Controller
const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event listeners
  loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors()

    // Add item event
    document.querySelector(UISelectors.addMeal).addEventListener('click', itemAddSubmit);

    // Disable submit on enter key press
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })

    // Edit icon click Event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditSubmit);

    // Update item event
    document.querySelector(UISelectors.updateMeal).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteMeal).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.back).addEventListener('click', UICtrl.clearEditState);

    // Clear item event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

  }

  // Add item submit
  const itemAddSubmit = function (e) {
    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //Add Item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      totalCalories = ItemCtrl.getTotalCalories();
      // Add totalCalories to UI list
      UICtrl.showTotalCalories(totalCalories);

      // Store in local storage
      StorageCtrl.storeItem(newItem);

      // Clear fields on li
      UICtrl.ClearInput();
    }

    e.preventDefault();
  }

  // Edit item sumbit
  const itemEditSubmit = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id

      // Break into an array
      const listIdArr = listId.split('.');

      // Get the actual id
      id = parseInt(listIdArr[1]);

      // Get item 
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }


    e.preventDefault();
  }

  // update item submit
  const itemUpdateSubmit = function (e) {
    // Get item input 
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    totalCalories = ItemCtrl.getTotalCalories();
    // Add totalCalories to UI list
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage 
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState()


    e.preventDefault();
  }

  // Delete Meal event
  const itemDeleteSubmit = (e) => {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    totalCalories = ItemCtrl.getTotalCalories();
    // Add totalCalories to UI list
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LS
    StorageCtrl.deleteFromStorage(currentItem.id);

    UICtrl.clearEditState()


    e.preventDefault();
  }

  // Clear items event
  const clearAllItemsClick = function () {
    // Delete all items from data Structure
    ItemCtrl.clearAllItems();

    // Get total calories
    totalCalories = ItemCtrl.getTotalCalories();
    // Add totalCalories to UI list
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear frm LS
    StorageCtrl.clearItemsFromStorage();


    // Hide UL
    UICtrl.hideList();
  }

  // Public methods
  return {
    init: function () {
      // Set intial state 
      UICtrl.clearEditState();

      // Fetch items from data structure
      items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      totalCalories = ItemCtrl.getTotalCalories();
      // Add totalCalories to UI list
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();

    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

App = AppCtrl

// Initialize App
App.init()