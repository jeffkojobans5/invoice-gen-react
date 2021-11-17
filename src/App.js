import React from 'react';
import { BsFillTrashFill } from "react-icons/bs";
import Pdf from "react-to-pdf";
import './App.css';
const axios = require('axios');


function App() {
  
  const ref = React.createRef();
  let todayDate = new Date().toISOString().slice(0, 10);

  // STATES
  // const [invoiceName , setInvoiceName] = React.useState('Invoice');
  const [value , setValue] = React.useState({ 
    companyName : "Company Name" , 
    invoiceName : "Invoice" , 
    invoiceNumber : "1" ,
    sender: "",
    billToText: "Bill To",
    shipToText: "Ship To",
    billTo: "",
    shipTo: "",
    dateStartText: "Date",
    dateEndText: "Date End",
    dateStart: todayDate,
    dateEnd : "",
    descriptionText: "Description",
    priceText: "Price",
    quantityText: "Quantity",
    rateText: "Rate",
    amountText: "Amount",
    notes: "notes"
  });

  const [currencySymbol , setCurrencySymbol ] = React.useState("GHS")
  const [currency , setCurrency ] = React.useState('GHS')
  const [currencyName , setCurrencyName ] = React.useState('Ghanaian Cedi')
  const [internetStatus , setInternetStatus ] = React.useState(true)
  const [ totalPrice , setTotalPrice ] = React.useState(0)
  const [ checkDownload , setCheckDownload] = React.useState(false);
  // handles Frame of input
  const [ block , setBlock ] = React.useState([  
    { description : "" , quantity : 0 , price : 0 , total : 0 , hvr : false },
   ])

  // FUNCTIONS
  // hoverState 
  const mouseIn = (e, index) => {
    let change = [...block];
    change[index]['hvr'] = true;
    setBlock(change)
  }

  // handlesInputChnage
  const handleChangeInput = (e , index) => {
    const blockCopy = [...block];
    blockCopy[index][e.target.name] = e.target.value;
    blockCopy[index]['total'] = blockCopy[index]['price'] *  blockCopy[index]['quantity']
    setBlock(blockCopy)
  }

  // setMouseLeave
  const mouseLeave = (e ,index) => {
    let change = [...block];
    change[index]['hvr'] = false;
    setBlock(change)
  }  

  // handlesInput Except description - quantity - price / rate - amount
  const changeText = (e) => {
    setValue({
      ...value,
      [e.target.name] : e.target.value
    })
  }

  // handles new line of Block inserted into DOM
  const addNewBlock = () => {
    setBlock([...block , { description : "" , quantity : 0 , price : 0 , total : 0 } ])
  }

  // deletes block
  const deleteBlock = (index) => {
    let blockCopy = [...block]
    blockCopy.splice(index , 1)
      setBlock(blockCopy)
  }

  // sums total of all inputs on block state change
  React.useEffect(()=> {
    let sumWithPrice = 0;
    for (let a in block) {
      sumWithPrice += block[a]['total']
    }
    setTotalPrice(sumWithPrice)
  },[block])  

  
  const url = 'https://gist.githubusercontent.com/Fluidbyte/2973986/raw/8bb35718d0c90fdacb388961c98b8d56abc392c9/Common-Currency.json';

  const handleSelect = (e) => {
    setCurrency(e.target.value)
  }

  // FETCHES API
  const fetchCurrency = () => {
    axios.get(url)
      .then(response => {
        setCurrencySymbol(response.data[currency]['symbol'])
        setCurrencyName(response.data[currency]['name'])
      }).catch(error => {
        console.log(error)
        setInternetStatus(false)
      })
  }

  React.useEffect(()=> {
    fetchCurrency()
    // eslint-disable-next-line
  },[])

  return (
    <div className="sm:w-4/6 mx-auto  mb-10 pt-8 flex flex-col justify-center items-start lg:flex-row full">
    <div ref={ref} className="max-w-screen-md bg-white p-5 mb-5 border-b-4 border-r-4 rounded-lg lg:max-w-screen-md	" id="pdf_file" >
          <div className="sm:flex flex-col md:flex-row justify-end "> 
          <div className="logo flex-1">
            {/* <input type="file" name="logo" id="logo" /> */}
          <textarea 
          type="text" 
          placeholder="" 
          name="companyName" 
          value={value.companyName}  
          onChange={changeText} 
          className="text-left mb-3  text-lg py-1 text-gray-600 px-4 w-full font-Poppins focus:outline-none focus:ring-1 rounded"></textarea>          
          </div> 

          {/* invoice  */}
        <div className="flex-col items-start md:items-end lg:flex-1 flex ">            
          <input 
          type="text" 
          placeholder="" 
          name="invoiceName" 
          value={value.invoiceName}  
          onChange={changeText} 
          className="sm:text-left mb-3 md:text-right text-3xl py-1 text-gray-600 px-4 w-4/6 font-Poppins focus:outline-none focus:ring-1 rounded" />
          {/* ends invoice number */}

        {/* invoice number */}
        <div className="border rounded">
            <div className="inline bg-gray-200 py-2 px-4 text-gray-600 select-none">#</div>
              <input 
              type="text" 
              placeholder="" 
              name="invoiceNumber" 
              value={value.invoiceNumber} 
              onChange={changeText} 
              className="bg-transparent font-Poppins py-1 px-4 text-right text-gray-600  focus:outline-none " />
          </div>
          {/*  end invoice number */}
          </div>
        </div>    

        {/* sender option */}
        <div className="flex-col info-date md:flex text-sm font-Poppins md:flex-row mt-10 justify-end">
            <div className="info flex-1 flex flex-col">
              <textarea
                rows="3"
                type="textarea"
                name="sender"
                id="sender"
                value={value.sender}
                onChange={changeText}
                className="w-full lg:w-4/6 rounded border text-sm   box-border font-Poppins border-gray-200 py-1 px-3 block focus:outline-none ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Who is this invoice from (required)"
              ></textarea>
            <div className="bill-ship mt-5 flex">
              <input 
                type="text" 
                placeholder="" 
                name="billToText" 
                value={value.billToText}  
                onChange={changeText} 
                className="text-left flex-1 w-full py-1 text-gray-600 px-4 focus:outline-none ring-blue-500" />
                {/* ship and bill to placeholders */}
              <input 
                type="text" 
                placeholder="" 
                name="shipToText" 
                value={value.shipToText}  
                onChange={changeText} 
                className=" text-left flex-1 w-full py-1 text-gray-600 px-4 focus:outline-none " />                            
              </div>
          <div className="billShipAddress flex">
                  {/* ship and billto  */}
              <textarea
                    rows="3"
                    type="textarea"
                    name="billTo"
                    id="billTo"
                    value={value.billTo}
                    onChange={changeText}                    
                    className=" flex-1 rounded w-full border border-gray-200 py-1 px-3 block focus:outline-none ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="Who is this invoice to (required)"
                  ></textarea>
                <textarea
                  rows="3"
                  type="textarea"
                  name="shipTo"
                  id="shipTo"
                  value={value.shipTo}
                  onChange={changeText}                  
                  className="flex-1 w-full rounded border ml-3 border-gray-200 py-1 px-3 block focus:outline-none ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder=""
                ></textarea>                  
          </div>
          </div>          
          {/* end ship and everything here */}

          {/* DATES  */}
          <div className="date mt-2 flex-1 text-sm ml-5 text-gray-600 flex-col"> 
            <div className="startDate flex">
              <input 
                  type="text" 
                  placeholder="" 
                  name="dateStartText" 
                  value={value.dateStartText}  
                  onChange={changeText} 
                  className="text-left px-0 mr-6 md:mr-0 md:text-right w-full flex-1 py-1 text-gray-600 md:px-4 focus:outline-none" />   
              <input 
                  type="text" 
                  placeholder="" 
                  name="dateStart" 
                  value={value.dateStart}  
                  onChange={changeText} 
                  className="text-right w-full flex-1 py-2 border border-gray-200 text-gray-600 px-4 font-Poppins focus:outline-none focus:ring-1 rounded" />                            
            </div>  

          <div className="endDate mt-2 flex">
            <input 
                type="text" 
                placeholder="" 
                name="dateEndText" 
                value={value.dateEndText}  
                onChange={changeText} 
                className="text-left px-0 mr-6 md:mr-0 md:text-right w-full flex-1 md:py-1 md:px-4 text-gray-600 focus:outline-none" />   
            <input 
                type="text" 
                placeholder="" 
                name="dateEnd" 
                value={value.dateEnd}  
                onChange={changeText} 
                className="text-right w-full flex-1 py-2 border border-gray-200 text-gray-600 px-4 font-Poppins focus:outline-none focus:ring-1 rounded" />                            
            </div>                                   
          </div>
        </div>        

      {/* start of table */}
        <div className="tableHead mt-12  flex-col md:flex-row flex text-sm bg-gray-900 ">
          <div className="description md:w-5/12">
          <input 
                type="text" 
                placeholder="" 
                name="descriptionText" 
                value={value.descriptionText}  
                onChange={changeText} 
                className="bg-transparent text-left  w-full m-1 py-1 text-white px-4 focus:outline-none focus:bg-gray-800" />             
          </div>
          <div className="w-full qty md:w-2/12">
            <input 
                  type="text" 
                  placeholder="" 
                  name="quantityText" 
                  value={value.quantityText}  
                  onChange={changeText} 
                  className="bg-transparent text-left  w-full m-1 py-1 text-white px-4 focus:outline-none focus:bg-gray-800" />       
            </div>
          <div className="rate md:w-2/12">
              <input 
                    type="text" 
                    placeholder="" 
                    name="rateText" 
                    value={value.rateText}  
                    onChange={changeText} 
                    className="bg-transparent text-left  w-full m-1 py-1 text-white px-4 focus:outline-none focus:bg-gray-800" /> 
          </div>
          <div className="amount md:w-2/12">
            <input 
                    type="text" 
                    placeholder="" 
                    name="amountText" 
                    value={value.amountText}  
                    onChange={changeText} 
                    className="text-left bg-transparent md:text-right  w-full m-1 py-1 text-white px-4 focus:outline-none focus:bg-gray-800" />                     
          </div>
          </div>  

      {block.map((singleItem , index) => {
        return (
          <div className="mt-3 flex-col tableHead md:mt-0 md:flex-row flex text-sm" key={index} onMouseOver={ (e)=>mouseIn(e , index)} onMouseLeave={ (e)=> mouseLeave(e , index)}>
          <div className="description w-full md:w-5/12">
          <textarea 
                type="text" 
                placeholder="Description of items / service" 
                name="description" 
                value={block.description}  
                onChange = { (event) => handleChangeInput( event , index)}    
                className="w-full bg-transparent rounded border text-left  m-0 md:w-full md:m-1 py-1 text-gray-600 px-4 focus:outline-none focus:ring-1" 
                ></textarea>
          </div>
          <div className="qty w-full md:w-2/12">
            <input 
                  type="number" 
                  placeholder="1" 
                  name="quantity" 
                  value={block.quantity}  
                  onChange = { (event) => handleChangeInput( event , index)}    
                  className=" w-full bg-transparent rounded border md:text-left ml-0 md:w-full m-1 py-2 md:ml-2  text-gray-600 px-4 focus:outline-none focus:ring-1" />       
            </div>
          <div className="rate w-full md:w-2/12">
            <div className="ml-0 rounded border mt-1 md:ml-3 border-gray-200 focus:border-none flex" >
                <div className=" bg-white py-2 px-2 text-gray-600 select-none"> { currency } </div>
                  <input 
                  type="number" 
                  placeholder="1" 
                  name="price" 
                  value={block.price} 
                  onChange = { (event) => handleChangeInput( event , index)}    
                  className="bg-transparent w-full font-Poppins py-1 px-1 text-center text-gray-600  focus:outline-none focus:ring-1" />
              </div>

          </div>
          <div className="amount w-full md:w-2/12">
              <h2 className="mt-3 text-right mr-3 font-Poppins text-sm text-gray-600"> <span className="text-red-900">{ currencySymbol } &nbsp;  </span> { block[index]['total'] } </h2>                    
          </div>
          <div className="amount w-full md:w-1/12 flex justify-center items-center">
              { block.length > 1 && singleItem.hvr  ? <BsFillTrashFill onClick={()=>deleteBlock(index)} className="-mt-5 cursor-pointer text-gray-600 transition  text-xl hover:text-red-800"/> : "" }            
          </div>          
          </div>  
          )
          })}

          <div className="invoice-fields flex ">
            <div className=" flex-1">
              { checkDownload ? <button type="button" onClick = { ()=>addNewBlock()} className="btn mt-5 bg-yellow-500 text-gray-800 py-1 px-3 rounded border-b-2 border-r-2"> + Add Item</button> : " " }
            </div>
            <div className="mr-2 flex-1 flex justify-end items-end md:mr-10">
              <h1> <span className="text-red-800">Total : </span> { currencySymbol } { totalPrice } </h1>
            </div>            
          </div>       
          <div className="container">
          </div>          
        </div>

        {/* currencySymbol and rest */}
          <div className="w-full md:download-as-pdf ml-0 font-Poppins lg:ml-3 md:w-2/6	">
            <Pdf targetRef={ref} filename="InvoiceNo.pdf">
              {({ toPdf }) => <button type="submit" onClick={toPdf} className="bg-red-400 text-white px-2 py-2 rounded w-full block mb-10" onMouseOver={()=>setCheckDownload(false)} onMouseLeave={()=>setCheckDownload(true)} >  DOWNLOAD </button>}
            </Pdf>      

            <p>Choose Currency : <span className="text-red-700"> { currencyName } </span></p>
            <select className="w-full mt-5 p-2 border rounded focus:outline-none focus:ring-1" name="currency" value={currency} onChange={(e)=>handleSelect(e)} id="select_currencySymbol">
                                                            <option value="AED" >AED</option>
                                                            <option value="AFN" >AFN</option>
                                                            <option value="ALL" >ALL</option>
                                                            <option value="AMD" >AMD</option>
                                                            <option value="ARS" >ARS</option>
                                                            <option value="AUD" >AUD</option>
                                                            <option value="AZN" >AZN</option>
                                                            <option value="BAM" >BAM</option>
                                                            <option value="BDT" >BDT</option>
                                                            <option value="BGN" >BGN</option>
                                                            <option value="BHD" >BHD</option>
                                                            <option value="BIF" >BIF</option>
                                                            <option value="BND" >BND</option>
                                                            <option value="BOB" >BOB</option>
                                                            <option value="BRL" >BRL</option>
                                                            <option value="BZD" >BZD</option>
                                                            <option value="CAD" >CAD</option>
                                                            <option value="CDF" >CDF</option>
                                                            <option value="CHF" >CHF</option>
                                                            <option value="CLP" >CLP</option>
                                                            <option value="CNY" >CNY</option>
                                                            <option value="COP" >COP</option>
                                                            <option value="CRC" >CRC</option>
                                                            <option value="CVE" >CVE</option>
                                                            <option value="CZK" >CZK</option>
                                                            <option value="DJF" >DJF</option>
                                                            <option value="DKK" >DKK</option>
                                                            <option value="DOP" >DOP</option>
                                                            <option value="DZD" >DZD</option>
                                                            <option value="EGP" >EGP</option>
                                                            <option value="ERN" >ERN</option>
                                                            <option value="ETB" >ETB</option>
                                                            <option value="EUR" >EUR</option>
                                                            <option value="GBP" >GBP</option>
                                                            <option value="GEL" >GEL</option>
                                                            <option value="GHS" >GHS</option>
                                                            <option value="GNF" >GNF</option>
                                                            <option value="GTQ" >GTQ</option>
                                                            <option value="HKD" >HKD</option>
                                                            <option value="HNL" >HNL</option>
                                                            <option value="HRK" >HRK</option>
                                                            <option value="HUF" >HUF</option>
                                                            <option value="IDR" >IDR</option>
                                                            <option value="ILS" >ILS</option>
                                                            <option value="INR" >INR</option>
                                                            <option value="IQD" >IQD</option>
                                                            <option value="IRR" >IRR</option>
                                                            <option value="ISK" >ISK</option>
                                                            <option value="JMD" >JMD</option>
                                                            <option value="JOD" >JOD</option>
                                                            <option value="JPY" >JPY</option>
                                                            <option value="KES" >KES</option>
                                                            <option value="KHR" >KHR</option>
                                                            <option value="KMF" >KMF</option>
                                                            <option value="KRW" >KRW</option>
                                                            <option value="KZT" >KZT</option>
                                                            <option value="LBP" >LBP</option>
                                                            <option value="LKR" >LKR</option> 
                                                            <option value="LTL" >LTL</option>
                                                            <option value="LVL" >LVL</option>
                                                            <option value="LYD" >LYD</option>
                                                            <option value="MAD" >MAD</option>
                                                            <option value="MDL" >MDL</option>
                                                            <option value="MGA" >MGA</option>
                                                            <option value="MKD" >MKD</option>
                                                            <option value="MUR" >MUR</option>
                                                            <option value="MXN" >MXN</option>
                                                            <option value="MYR" >MYR</option>
                                                            <option value="MZN" >MZN</option>
                                                            <option value="NAD" >NAD</option>
                                                            <option value="NGN" >NGN</option>
                                                            <option value="NIO" >NIO</option>
                                                            <option value="NOK" >NOK</option>
                                                            <option value="NPR" >NPR</option>
                                                            <option value="NZD" >NZD</option>
                                                            <option value="OMR" >OMR</option>
                                                            <option value="PAB" >PAB</option>
                                                            <option value="PEN" >PEN</option>
                                                            <option value="PHP" >PHP</option>
                                                            <option value="PKR" >PKR</option>
                                                            <option value="PLN" >PLN</option>
                                                            <option value="PYG" >PYG</option>
                                                            <option value="QAR" >QAR</option>
                                                            <option value="RSD" >RSD</option>
                                                            <option value="RUB" >RUB</option>
                                                            <option value="RWF" >RWF</option>
                                                            <option value="SAR" >SAR</option>
                                                            <option value="SDG" >SDG</option>
                                                            <option value="SEK" >SEK</option>
                                                            <option value="SGD" >SGD</option>
                                                            <option value="SOS" >SOS</option>
                                                            <option value="SYP" >SYP</option>
                                                            <option value="THB" >THB</option>
                                                            <option value="TND" >TND</option>
                                                            <option value="TOP" >TOP</option>
                                                            <option value="TRY" >TRY</option>
                                                            <option value="TTD" >TTD</option>
                                                            <option value="TWD" >TWD</option>
                                                            <option value="TZS" >TZS</option>
                                                            <option value="UAH" >UAH</option>
                                                            <option value="UGX" >UGX</option>
                                                            <option value="USD" >USD</option>
                                                            <option value="UYU" >UYU</option>
                                                            <option value="UZS" >UZS</option>
                                                            <option value="VEF" >VEF</option>
                                                            <option value="VND" >VND</option>
                                                            <option value="XAF" >XAF</option>
                                                            <option value="XOF" >XOF</option>
                                                            <option value="YER" >YER</option>
                                                            <option value="ZAR" >ZAR</option>
                                                    </select>
      { !internetStatus ? <p className="text-sm mt-5 text-red-300"> Connect to Internet for currency change </p> : ""   }                                                    
      </div>
    </div>
  );
}



export default App;
