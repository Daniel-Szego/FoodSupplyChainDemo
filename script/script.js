/**
 * Transaction file for green supply chain
 */

const namespace = "org.supplychain.green.model";

/**
 *
 * @param {org.supplychain.green.model.InitTestData} param - model instance
 * @transaction
 */
async function InitTestDataFunction(param) {  
  
      const ghgBsaeLineInfo = await request.get( { uri:'https://iaspub.epa.gov/enviro/efservice/tri_facility/state_abbr/VA/rows/102:102/JSON', json: true});
    const baseline = parseInt(ghgBsaeLineInfo[0].PREF_QA_CODE) / 10;

    console.log('init test data');

    console.log('Creating a manufacturer company');  
    const factory = getFactory(); 
	
  	// adding manufacturer company 
    const manCompReg = await getParticipantRegistry(namespace + '.ManufacturerCompany');   
    const manComp = await factory.newResource(namespace, 'ManufacturerCompany', "1");
    manComp.companyName = "Cell phone Manufacturer Inc.";
    manComp.GHG = baseline;
    const newAddress = await factory.newConcept(namespace, 'CompanyAddress');
	newAddress.country = "Bejing";
	newAddress.city = "China";
	newAddress.street = "Xia Mo Street";
    newAddress.hauseNr = 16;
  	manComp.companyAddress = newAddress;
  
    await manCompReg.add(manComp);       

  	// adding transportation company 1
    console.log('Creating a transportation company 1');  

    const transCompReg = await getParticipantRegistry(namespace + '.TransportationCompany');   
    const transComp1 = await factory.newResource(namespace, 'TransportationCompany', "2");
    transComp1.companyName = "Truck Transport Inc.";
    transComp1.GHG = baseline / 2;
    const newAddress2 = await factory.newConcept(namespace, 'CompanyAddress');
	newAddress2.country = "Hong Kong";
	newAddress2.city = "China";
	newAddress2.street = "Mua Mo Street";
    newAddress2.hauseNr = 22;
  	transComp1.companyAddress = newAddress2;
    transComp1.transportFrom = new Array();
    transComp1.transportFrom.push(manComp);
  
    await transCompReg.add(transComp1);       
  
    // adding relay company 1
    console.log('Creating a relay company 1');  

    const relayCompReg = await getParticipantRegistry(namespace + '.RelayCompany');   
    const relayComp1 = await factory.newResource(namespace, 'RelayCompany', "5");
    relayComp1.companyName = "Harbour";
    relayComp1.GHG = baseline / 1.75;
    const newAddress5 = await factory.newConcept(namespace, 'CompanyAddress');
	newAddress5.country = "China";
	newAddress5.city = "Hong Kong";
	newAddress5.street = "Seeside";
    newAddress5.hauseNr = 4;
  	relayComp1.companyAddress = newAddress5;

    await relayCompReg.add(relayComp1);       

  
  	// adding transportation company 2
    console.log('Creating a transportation company 2');  

    const transComp2 = await factory.newResource(namespace, 'TransportationCompany', "3");
    transComp2.companyName = "Shipping Inc.";
    transComp2.GHG = baseline * 1.5;
    const newAddress3 = await factory.newConcept(namespace, 'CompanyAddress');
	newAddress3.country = "Sydney";
	newAddress3.city = "Australia";
	newAddress3.street = "Beecon Str";
    newAddress3.hauseNr = 122;
  	transComp2.companyAddress = newAddress3;
    transComp2.transportFrom = new Array();
    transComp2.transportFrom.push(relayComp1);  
  
    await transCompReg.add(transComp2);       

    // adding relay company 2
    console.log('Creating a relay company 2');  

    const relayComp2 = await factory.newResource(namespace, 'RelayCompany', "6");
    relayComp2.companyName = "Harbour";
    relayComp2.GHG = baseline * 1.25;
    const newAddress6 = await factory.newConcept(namespace, 'CompanyAddress');
	newAddress6.country = "Italy";
	newAddress6.city = "Triest";
	newAddress6.street = "Via Rue";
    newAddress6.hauseNr = 44;
  	relayComp2.companyAddress = newAddress6;

    await relayCompReg.add(relayComp2);       

  
    // adding transportation company 3
    console.log('Creating a transportation company 3');  

    const transComp3 = await factory.newResource(namespace, 'TransportationCompany', "4");
    transComp3.companyName = "Fast Train Transport";
    transComp3.GHG = baseline * 0.8;
    const newAddress4 = await factory.newConcept(namespace, 'CompanyAddress');
	newAddress4.country = "Italy";
	newAddress4.city = "Venice";
	newAddress4.street = "Via Margutta";
    newAddress4.hauseNr = 8;
  	transComp3.companyAddress = newAddress4;
    transComp3.transportFrom = new Array();
    transComp3.transportFrom.push(relayComp2);

    await transCompReg.add(transComp3);       
 
  	// adding sales company 
    console.log('Creating a Sales company 1');  

    const salesCompReg = await getParticipantRegistry(namespace + '.SalesCompany');   
    const salesComp = await factory.newResource(namespace, 'SalesCompany', "5");
    salesComp.companyName = "Sales Co.";
    salesComp.GHG = baseline * 0.4;
    const newAddress7 = await factory.newConcept(namespace, 'CompanyAddress');
	newAddress7.country = "Hungary";
	newAddress7.city = "Budapest";
	newAddress7.street = "Bartok Bela ut";
    newAddress7.hauseNr = 44;
  	salesComp.companyAddress = newAddress7;
  
    await salesCompReg.add(salesComp);         
}

/**
 *
 * @param {org.supplychain.green.model.ClearData} param - model instance
 * @transaction
 */
async function ClearDataFunction(param) {  
    console.log('clearing test data');

    // deleting assets
    const cellPhoneRegistry = await getAssetRegistry(namespace + '.CellPhone'); 
    let cellPhones = await cellPhoneRegistry.getAll();
    await cellPhoneRegistry.removeAll(cellPhones);
  
  	// deleting participants
    const manCompRegistry = await getParticipantRegistry(namespace + '.ManufacturerCompany');
    let manCompanies = await manCompRegistry.getAll();
    await manCompRegistry.removeAll(manCompanies);
    
    const salesCompRegistry = await getParticipantRegistry(namespace + '.SalesCompany'); 
    let salesCompanies = await salesCompRegistry.getAll();
    await salesCompRegistry.removeAll(salesCompanies);
  
    const relayCompRegistry = await getParticipantRegistry(namespace + '.RelayCompany'); 
    let relayCompanies = await relayCompRegistry.getAll();
    await relayCompRegistry.removeAll(relayCompanies);

    const trCompRegistry = await getParticipantRegistry(namespace + '.TransportationCompany'); 
    let trCompanies = await trCompRegistry.getAll();
    await trCompRegistry.removeAll(trCompanies);
  
    console.log('clearing all data finished');  
}

/**
 *
 * @param {org.supplychain.green.model.Transfer} param - model instance
 * @transaction
 */
async function TransferFunction(param) {  
	let assetToTransfer = param.assetToTransfer;
    let fromCompany = param.fromCompany;
    let toCompany = param.toCompany;
  
  	// checking if transfer is valid
    
    if(toCompany.transportFrom) {
      	let isValidTransfer = false;
	    await toCompany.transportFrom.forEach(function (company) {
			if(company == fromCompany)
            {
              	isValidTransfer = true;
            }
        });
  		if(isValidTransfer == false) {
        	throw new Error('Invalid transfer');
        }  
    }
    	
  	assetToTransfer.atCompany = toCompany;
    assetToTransfer.aggregatedGHG = assetToTransfer.aggregatedGHG + toCompany.GHG;     	  assetToTransfer.assetStatus = "ON_THE_ROAD";
  	
    const cellPhoneReg = await getAssetRegistry(namespace + '.CellPhone'); 
    await cellPhoneReg.update(assetToTransfer);    
  
  	// emitting Transfer event
    let factory = await getFactory();

    let transferEvent = factory.newEvent('org.supplychain.green.model', 'AssetTransferred');
  	transferEvent.gHGcarrierAsset = assetToTransfer;
  	transferEvent.transferGHG = assetToTransfer.aggregatedGHG;
    await emit(transferEvent);  	
}

/**
 *
 * @param {org.supplychain.green.model.Produce} param - model instance
 * @transaction
 */
async function ProduceFunction(param) {  
	let manCompany = param.manufacturerCompany;
    let factory = await getFactory();
  
    // creating cell phone
    const cellPhoneReg = await getAssetRegistry(namespace + '.CellPhone');   

    // getting next id
    let existingPhones = await cellPhoneReg.getAll();
  	let numberOfPhones = 0;
  
    await existingPhones.forEach(function (phone) {
      numberOfPhones ++;
    });
 	numberOfPhones ++; 	

    const newCellPhone = await factory.newResource(namespace, 'CellPhone', numberOfPhones.toString());
    newCellPhone.assetStatus = "CREATED";
    newCellPhone.aggregatedGHG = manCompany.GHG;
    newCellPhone.atCompany = manCompany;
    newCellPhone.cellPhoneType = "LENOVO";
    newCellPhone.amount = 1;
    await cellPhoneReg.add(newCellPhone);       
  
  	// emitting create event

    let createEvent = factory.newEvent('org.supplychain.green.model', 'AssetCreated');
  	createEvent.gHGcarrierAsset = newCellPhone;
  	createEvent.creationGHG = newCellPhone.aggregatedGHG;
    await emit(createEvent);  	
}

/**
 *
 * @param {org.supplychain.green.model.Sell} param - model instance
 * @transaction
 */
async function SellFunction(param) {  
	let assetToTransfer = param.assetToSell;
    let factory = await getFactory();
 	
  	assetToTransfer.assetStatus = "SOLD";
  	
    const cellPhoneReg = await getAssetRegistry(namespace + '.CellPhone'); 
    await cellPhoneReg.update(assetToTransfer);    
  
  	// emitting Sold event

    let soldEvent = factory.newEvent('org.supplychain.green.model', 'AssetSold');
  	soldEvent.gHGcarrierAsset = assetToTransfer;
  	soldEvent.sellingGHG = assetToTransfer.aggregatedGHG;
    await emit(soldEvent);  	
}
