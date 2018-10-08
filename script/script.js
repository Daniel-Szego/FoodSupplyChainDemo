/**
 * Transaction file for food supply chain
 */

const namespace = "org.supplychain.food.model";

/**
 *
 * @param {org.supplychain.food.model.InitTestData} param - model instance
 * @transaction
 */
async function InitTestDataFunction(param) {  
  
      const ghgBsaeLineInfo = await request.get( { uri:'https://iaspub.epa.gov/enviro/efservice/tri_facility/state_abbr/VA/rows/102:102/JSON', json: true});
    const baseline = parseInt(ghgBsaeLineInfo[0].PREF_QA_CODE) / 10;

    console.log('init test data');

    console.log('Creating a Production state');  
    const factory = getFactory(); 
	
  	// adding Production state 
    const productionReg = await getParticipantRegistry(namespace + '.Production');   
    const production = await factory.newResource(namespace, 'Production', "1");
    production.stateName = "Production";
    production.GHG = baseline;
    const newAddress = await factory.newConcept(namespace, 'Address');
	newAddress.country = "Bejing";
	newAddress.city = "China";
	newAddress.street = "Xia Mo Street";
    newAddress.hauseNr = 16;
  	production.stateAddress = newAddress;
  
    await productionReg.add(production);       

  	// adding Processing State
    console.log('Creating a Processing state');  

    const processingReg = await getParticipantRegistry(namespace + '.Processing');   
    const processing = await factory.newResource(namespace, 'Processing', "2");
    processing.stateName = "Processing";
    processing.GHG = baseline / 2;
    const newAddress2 = await factory.newConcept(namespace, 'Address');
	newAddress2.country = "Hong Kong";
	newAddress2.city = "China";
	newAddress2.street = "Mua Mo Street";
    newAddress2.hauseNr = 22;
  	processing.stateAddress = newAddress2;
    processing.stateFrom = new Array();
    processing.stateFrom.push(production);
  
    await processingReg.add(processing);       
  
    // adding Distribution State 
    console.log('Creating a Distribution State');  

    const distributionReg = await getParticipantRegistry(namespace + '.Distribution');   
    const distribution = await factory.newResource(namespace, 'Distribution', "3");
    distribution.stateName = "Distribution";
    distribution.GHG = baseline / 1.75;
    const newAddress5 = await factory.newConcept(namespace, 'Address');
	newAddress5.country = "China";
	newAddress5.city = "Hong Kong";
	newAddress5.street = "Seeside";
    newAddress5.hauseNr = 4;
  	distribution.stateAddress = newAddress5;
    distribution.stateFrom = new Array();
    distribution.stateFrom.push(processing);

    await distributionReg.add(distribution);       
  
  	// adding Retail State
    console.log('Creating a Retail State');  
  
    const retailReg = await getParticipantRegistry(namespace + '.Retail'); 
    const retail = await factory.newResource(namespace, 'Retail', "4");
    retail.stateName = "Retail";
    retail.GHG = baseline * 1.5;
    const newAddress3 = await factory.newConcept(namespace, 'Address');
	newAddress3.country = "Sydney";
	newAddress3.city = "Australia";
	newAddress3.street = "Beecon Str";
    newAddress3.hauseNr = 122;
  	retail.stateAddress = newAddress3;
    retail.stateFrom = new Array();
    retail.stateFrom.push(distribution);  
  
    await retailReg.add(retail);       

    // adding Restaurant 
    console.log('Creating a Restaurant State');  

    const restaurantReg = await getParticipantRegistry(namespace + '.Restaurant'); 
    const restaurant = await factory.newResource(namespace, 'Restaurant', "5");
    restaurant.stateName = "Restaurant";
    restaurant.GHG = baseline * 1.25;
    const newAddress6 = await factory.newConcept(namespace, 'Address');
	newAddress6.country = "Italy";
	newAddress6.city = "Triest";
	newAddress6.street = "Via Rue";
    newAddress6.hauseNr = 44;
  	restaurant.stateAddress = newAddress6;
    restaurant.stateFrom = new Array();
    restaurant.stateFrom.push(retail);  
  
    await restaurantReg.add(restaurant);       
}

/**
 *
 * @param {org.supplychain.food.model.ClearData} param - model instance
 * @transaction
 */
async function ClearDataFunction(param) {  
    console.log('clearing test data');

    // deleting assets
    const CowReg = await getAssetRegistry(namespace + '.Cow'); 
    let Cows = await CowReg.getAll();
    await CowReg.removeAll(Cows);

    const steakReg = await getAssetRegistry(namespace + '.Steak'); 
    let steaks = await steakReg.getAll();
    await steakReg.removeAll(steaks);
  
  	// deleting participants
    const productionReg = await getParticipantRegistry(namespace + '.Production');
    let production = await productionReg.getAll();
    await productionReg.removeAll(production);
    
    const processingReg = await getParticipantRegistry(namespace + '.Processing'); 
    let processing = await processingReg.getAll();
    await processingReg.removeAll(processing);
  
    const distributionReg = await getParticipantRegistry(namespace + '.Distribution'); 
    let istribution = await distributionReg.getAll();
    await distributionReg.removeAll(istribution);

    const retailReg  = await getParticipantRegistry(namespace + '.Retail'); 
    let retail = await retailReg.getAll();
    await retailReg.removeAll(retail);

    const restaurantReg  = await getParticipantRegistry(namespace + '.Restaurant'); 
    let restaurant = await restaurantReg.getAll();
    await restaurantReg.removeAll(restaurant);
  
    console.log('clearing all data finished');  
}

/**
 *
 * @param {org.supplychain.food.model.Process} param - model instance
 * @transaction
 */
async function ProcessFunction(param) {  
	let liveAsset = param.liveAsset;
    let fromState = param.fromState;
    let toState = param.toState;
  
    liveAsset.assetStatus = "PROCESSED";
  
  	// checking if transfer is valid
    
    if(fromState.stateFrom) {
      	let isValidTransfer = false;
	    await toState.stateFrom.forEach(function (state) {
			if(state == fromState)
            {
              	isValidTransfer = true;
            }
        });
  		if(isValidTransfer == false) {
        	throw new Error('Invalid transfer');
        }  
    }
    	
  	liveAsset.atState = toState;
    liveAsset.aggregatedGHG = liveAsset.aggregatedGHG + toState.GHG;     	  
    
    if (fromState.$type == "Processing") {
    	// producing meat from cow     	 
    	// delete cow
		let liveAssetReg = await getAssetRegistry(namespace + '.Cow');        
		liveAssetReg.remove(liveAsset);
            
        // create 2 Steaks
     	await ProduceMeat(toState); 
      
    } else {
    	
    	liveAsset.assetStatus = "PROCESSED";	
      	var liveAssetReg;
      	if (liveAsset.$type == "Cow") {
		     liveAssetReg = await getAssetRegistry(namespace + '.Cow');        
        }
        else if (liveAsset.$type == "Steak") {
		     liveAssetReg = await getAssetRegistry(namespace + '.Steak');            
        }
        else {
		     liveAssetReg = await getAssetRegistry(namespace + '.LiveAsset');         
        }
      
    	await liveAssetReg.update(liveAsset);    
  
  		// emitting Transfer event
    	let factory = await getFactory();

	    let transferEvent = factory.newEvent(namespace,	'AssetProcessed');
 	 	transferEvent.liveAsset = liveAsset;
  		transferEvent.transferGHG = liveAsset.aggregatedGHG;
    	await emit(transferEvent);  	      
    }    

}


 async function ProduceMeat(processing) {  
    let factory = await getFactory();
  
    // creating cell phone
    const meatReg = await getAssetRegistry(namespace + '.Steak');   

    // getting next id
    let existingMeats = await meatReg.getAll();
  	let numberOfMeats = 0;
  
    await existingMeats.forEach(function (meat) {
      numberOfMeats ++;
    });
 	numberOfMeats ++; 	

    const meat = await factory.newResource(namespace, 'Steak', numberOfMeats.toString());
   
    meat.assetStatus = "PROCESSED";
    meat.aggregatedGHG = processing.GHG;
    meat.atState = processing;
    meat.amount = 1;
    await meatReg.add(meat);       
  
  	// emitting create event

    let createEvent = factory.newEvent(namespace, 'AssetProduced');
  	createEvent.liveAsset = meat;
  	createEvent.creationGHG = meat.aggregatedGHG;
    await emit(createEvent);  	
}


/**
 *
 * @param {org.supplychain.food.model.Produce} param - model instance
 * @transaction
 */
async function ProduceFunctionCow(param) {  
    let production = param.atProduction;
    let factory = await getFactory();
  
    // creating cell phone
    const cowReg = await getAssetRegistry(namespace + '.Cow');   

    // getting next id
    let existingCows = await cowReg.getAll();
  	let numberOfCows = 0;
  
    await existingCows.forEach(function (cow) {
      numberOfCows ++;
    });
 	numberOfCows ++; 	

    const cow = await factory.newResource(namespace, 'Cow', numberOfCows.toString());
    cow.assetStatus = "LIVE";
    cow.aggregatedGHG = production.GHG;
    cow.atState = production;
    cow.amount = 1;
    await cowReg.add(cow);       
  
  	// emitting create event

    let createEvent = factory.newEvent(namespace, 'AssetProduced');
  	createEvent.liveAsset = cow;
  	createEvent.creationGHG = cow.aggregatedGHG;
    await emit(createEvent);  	
}

/**
 *
 * @param {org.supplychain.food.model.Consume} param - model instance
 * @transaction
 */
async function ConsumeFunction(param) {  
  	let assetToConsume = param.liveAsset;
    let restaurant = param.atRestaurant;
    let factory = await getFactory();
 	
  	assetToConsume.assetStatus = "CONSUMED";
  	
    const restaurantReg = await getAssetRegistry(namespace + '.LiveAsset'); 
    await restaurantReg.update(restaurant);    
  
  	// emitting Sold event

    let consumedEvent = factory.newEvent('org.supplychain.green.model', 'AssetConsumed');
  	consumedEvent.liveAsset = assetToConsume;
  	consumedEvent.endGHG = assetToConsume.aggregatedGHG;
    await emit(consumedEvent);  	
}