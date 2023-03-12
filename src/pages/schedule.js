import React,{useEffect, useRef, useState} from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid"
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import dayjs from 'dayjs'
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import emailjs from '@emailjs/browser';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    input: {
       backgroundColor: "rgb(255,255,255)",
      '& input[type=number]': {
          '-moz-appearance': 'textfield'
      },
      '& input[type=number]::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
      },
      '& input[type=number]::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
      },
        
    }
  });
let type = null;
let monday = [];
let tuesday = [];
let wednesday = [];
let thursday = [];
let friday = [];
let saturday = [];
let sunday = [];
let davalue;
let eventsValues;
export class Schedule extends React.Component{
    calendarRef = React.createRef();
    render(){
        
        return(
            <div id = "container">

            <div id = "calendar">  
                <FullCalendar
                    plugins={[timeGridPlugin,dayGridPlugin, dayGridPlugin, googleCalendarPlugin]}
                    initialView="timeGridWeek"
                    googleCalendarApiKey= 'AIzaSyDlokXCrlmdl7lsyfzJnVMKJK5EMlku9xY'
                    events={{
                        googleCalendarId: 'pvadl352@gmail.com'
                    }}
                    slotMinTime= "06:00:00"
                    slotMaxTime= "24:00:00"
                    headerToolbar={{
                        start: "title",
                        end:"reload today prev,next"
                    }}
                    ref = {this.calendarRef}
                    customButtons= {{
                        reload: {
                            text: "reload",
                            background: "rgb(255,255,255)",
                            click: ()=>{
                                console.log(this.calendarRef.current.getApi())
                                let cal = this.calendarRef.current.getApi();
                                cal.refetchEvents();
                            }
                        
                    }}
                }
                    eventDataTransform={ function(event) {
                        event.url = "";
                        return event;
                    }}
                    eventContent = {renderEventContent}
                    allDaySlot = {false} 
                    selectable = {false}
                    contentHeight = {550}
                      eventsSet={(events => {
                        RunPossibles(events)
                      })}
                />
        </div>
        <div id = "formarea">
            <EmailContactForm />       
        </div>
        
        </div>

    )
    }
}
function RunPossibles(events){
    eventsValues = events;
}
function Findslots(events, time){
     monday = [];
 tuesday = [];
 wednesday = [];
 thursday = [];
 friday = [];
 saturday = [];
 sunday = [];
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    if(events.length > 0){   
        var isBetween = require('dayjs/plugin/isBetween')
        var isBetween = require('dayjs/plugin/isBetween')
        var localizedFormat = require('dayjs/plugin/localizedFormat')
        var utc = require('dayjs/plugin/utc')
        var isYesterday = require('dayjs/plugin/isYesterday')
        dayjs.extend(isYesterday)
        dayjs.extend(utc)
        dayjs.extend(isBetween);
        dayjs.extend(localizedFormat);
        dayjs.extend(customParseFormat);
        events.sort((a, b) => -b._instance.range.start.toISOString().localeCompare(a._instance.range.start.toISOString()))
        var _ = require('lodash');
        events = _.values(_.groupBy(events, function(day){
            let date = new Date(day.start.getFullYear(), day.start.getMonth(), day.start.getDate());
            return dayjs(date).unix();
        }));

    // console.log(events);
    let startofdaySTR;
    let endofdaySTR;
    let appt_start;
    for(let i = 0; i<events.length; i++){
            let event_value = 0;
            if(i == 0){
                davalue = sunday;
            } else if(i == 1){
                davalue = monday;
            }else if(i == 2){
                davalue = tuesday;
            }else if(i == 3){
                davalue = wednesday;
            }else if(i == 4){
                davalue = thursday;
            }else if(i == 5){
                davalue = friday;
            }
            else if(i == 6){
                davalue = saturday;
            }
            let date = new Date(events[i][0].start.getFullYear(), events[i][0].start.getMonth(), events[i][0].start.getDate(), 15);
            let yesterday = new Date(date-6.12e+7);
            startofdaySTR = dayjs(dayjs(yesterday).unix(), ['X'])
            endofdaySTR = dayjs(dayjs(date).unix(), ['X']);
            appt_start = startofdaySTR;
            while((appt_start.diff(endofdaySTR, 'h')) != 0){
                let appt_end = appt_start.add(time, 'h');
                let slotAval = true;
                for(let j = 0; j< events[i].length; j++){

                
                let start  = events[i][j]._instance.range.start;
                let end = events[i][j]._instance.range.end;
                
                if(appt_start.isBetween(dayjs(start), dayjs(end))||appt_end.isBetween(dayjs(start), dayjs(end)) ||((appt_start).isSame(dayjs(start)) &&(appt_end.isSame(dayjs(end)))  || dayjs(start).isBetween(dayjs(appt_start), dayjs(appt_end)) || appt_end.isSame(dayjs(end)) || appt_start.isSame(dayjs(start)) )){
                    slotAval = false;        
                    break;
                } 

            }
            if(slotAval){
                davalue.push({value: dayjs(appt_start).utcOffset(0).format('L LT') + "-" + dayjs(appt_end).utcOffset(0).format('L LT'),
                              label: dayjs(appt_start).utcOffset(0).format('L LT') + "-" + dayjs(appt_end).utcOffset(0).format('L LT')});
                // davalue.push(dayjs(appt_start).utcOffset(0).format('L LT') + "-" + dayjs(appt_end).utcOffset(0).format('L LT'));
                event_value++;
            }
            
                appt_start = appt_start.add(0.5,'h');

            }
    
    }
    
    }

}
const EmailContactForm = () => {
    const classes = useStyles();
    const form = useRef();
    const [inputs, setInputs] = useState({});
    const [time,setTime] = useState("")
    const times = [{
        value: 0.5,
        label: "30 minutes"
    },{
        value: 0.75,
        label: "45 minutes"
    },
    {
        value: 1,
        label: "1 hour"
    },
    {
        value: 1.25,
        label: "1 hour 15 minutes"
    },
    {
        value: 1.5,
        label: "1 hour 30 minutes"
    },
    {
        value: 1.75,
        label: "1 hour 45 minutes"
    },
    {
        value: 2,
        label: "2 hours"
    },
    {
        value: 2.25,
        label: "2 hours 15 minutes"
    },
    {
        value: 2.5,
        label: "2 hours 30 minutes"
    },
    {
        value: 2.75,
        label: "2 hours 45 minutes"
    },
    {
        value: 3,
        label: "3 hours"
    },


]
    const days = [
        {
            value: "Sunday",
            label: "Sunday",
        },
        {
            value: "Monday",
            label: "Monday",
        },
        {
            value: "Tuesday",
            label: "Tuesday",
        },
        {
            value: "Wednesday",
            label: "Wednesday",
        },
        {
            value: "Thursday",
            label: "Thursday",
        },
        {
            value: "Friday",
            label: "Friday",
        },
        {
            value: "Saturday",
            label: "Saturday",
        }    
    ]
    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }
    // const setScheduleChange = (event) =>{
    //     console.log(event);
    // }
    const handleSubmit = (event) => {
      event.preventDefault();
    }
    const [selected, setSelected] = useState("");

    
    // if(selected === "Sunday"){
    //         type = sunday;
    //     } else if(selected === "Monday"){
    //         type = monday;
    //     }else if(selected === "Tuesday"){
    //         type = tuesday;
    //     }else if(selected === "Wednesday"){
    //         type = wednesday;
    //     }else if(selected === "Thursday"){
    //         type = thursday;
    //     }else if(selected === "Friday"){
    //         type = friday;
    //     }else if(selected === "Saturday"){
    //         type = saturday;
    //     }
    const [reloadMenu, setReloadMenu] = useState("");
    const changeSelectOptionHandler = (event) => {
        setSelected(event);
        // setReloadMenu("");
        // type = event;
        if(event.value === "Sunday"){
            type = sunday;
        } else if(event.value === "Monday"){
            type = monday;
        }else if(event.value === "Tuesday"){
            type = tuesday;
        }else if(event.value === "Wednesday"){
            type = wednesday;
        }else if(event.value === "Thursday"){
            type = thursday;
        }else if(event.value === "Friday"){
            type = friday;
        }else if(event.value === "Saturday"){
            type = saturday;
        }
        // } else {
        //     console.log("did not work");
        // }
      };
    // type = useAsync({});

    // const options =  useAsync({
    //     promiseFn: useCallback(() => loadOptions(inputValue), [inputValue])
    // });
    const getLabel = (option) => option.value;
    const getValue = (option) => option.key;
    const daysRef = useRef();
    const handleButtonChange = (event) =>{
        setReloadMenu(event.value);
        setReloadMenu(event.getLablel);
        setReloadMenu(event.getValue);

        // setSelected("");

    }
    
    const timeChange = (event) =>{
        const time = event.value;

        Findslots(eventsValues,time);
        setReloadMenu("");
        setSelected("");
        type = null;
        // daysRef.clearValue();
    }
    const sendEmail = (e) => {
      e.preventDefault(); // prevents the page from reloading when you hit “Send”
    
      emailjs.sendForm('service_1gvv9ux', 'template_n6te9xm', form.current, 'Vmdhh5bZDXe689287')
        .then((result) => {
            console.log("Work");
            console.log(result)

            // show the user a success message
        }, (error) => {
            // show the user an error
        });
    };
//     const promiseOptions =() =>
//   new Promise(resolve => {
//     setTimeout(() => {
//       resolve(RunPossibles(eventsValues, 1));
//     }, 1000);
//   });
    return (
        <form ref = {form} onSubmit={sendEmail} className = 'inpt'>
        <h1>Book a Lesson</h1>
        <label>Enter your name:
        {/* <input 
          type="text" 
          name="username" 
          value={inputs.username || ""} 
          onChange={handleChange}


        /> */}
        <TextField name = "username" variant="outlined" fullWidth placeholder='Sean Eshan' size = "small" className={classes.input}/>
        </label>
        <label>Email:
        {/* <input 
          type="text" 
          name="email" 
          value={inputs.email || ""} 
          onChange={handleChange}
        /> */}
        <TextField name = "email" variant="outlined" fullWidth placeholder='example@gmail.com' size = "small" className={classes.input}/>

        </label>
        <label>Phone:
          {/* <input 
            type="tel" 
            name="Phone" 
            value={inputs.number} 
            onChange={handleChange}
          /> */}
            <TextField type = "number" name = "phone" variant="outlined" fullWidth placeholder='000-000-0000' size = "small" className={classes.input}/>

          </label>
          <label>Age of Kid:
          {/* <input 
            type="number" 
            name="Phone" 
            value={inputs.number} 
            onChange={handleChange}
          /> */}
            <TextField type = "number"name = "age" variant="outlined" fullWidth placeholder='0' size = "small" className={classes.input}/>

          </label>
          <label>Length of Lesson:
          </label>
           <Select name = "time" options = {times || []} onChange = {timeChange}/>
           <label>Day of Week:
          </label>
           <Select value = {selected} name = "date" options={days||[]} onChange={changeSelectOptionHandler}
           
           ></Select>
           <label>Booking Times:
          </label>
           <Select
           name = "datevalue"
            options={type||[]} 
            // getOptionLabel = {getLabel}
            // getOptionValue = {getValue}
            value = {reloadMenu}
            onChange = {handleButtonChange}
            // ref = {buttonsRef}
            ></Select>
            {/* <AsyncSelect
        cacheOptions
        defaultOptions
        value = {type}
        loadOptions={type}
        // onInputChange={this.handleInputChange}
/> */}
          <input className='submitBtn' type="submit" value = "Send"/>
      </form>
    );
   };

  
function renderEventContent(arg) {
    return (
      <>
        <b>{arg.timeText}</b>
        <br></br>
        <b>{"\nBOOKED" + "\n"+ dayjs(arg.event.endStr).diff(dayjs(arg.event.startStr), 'hour', true) + " HOUR"}</b>
      </>
    )
  }