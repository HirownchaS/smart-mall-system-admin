import React, { useState } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import axios from 'axios';
import { scheduleData } from '../data/dummy';
import { Header } from '../components';

const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Scheduler = () => {
  const [scheduleObj, setScheduleObj] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now())); // State to store selected date

  const change = (args) => {
    const newDate = args.value;
    setSelectedDate(newDate);
    scheduleObj.selectedDate = newDate;
    scheduleObj.dataBind();
  };

  const onDragStart = (arg) => {
    arg.navigation.enable = true;
  };

  const onEventClick = (args) => {
    const eventDetails = args.event;
    console.log('Event Details:', eventDetails); // Log the event details to the console

    // Send the event details to the backend to save to MongoDB
    axios.post('http://localhost:8080/api/event/create', eventDetails)
      .then((response) => {
        console.log('Event saved successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error saving event:', error);
      });
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        height="650px"
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={selectedDate}
        eventSettings={{ dataSource: scheduleData }}
        dragStart={onDragStart}
        eventClick={onEventClick} // Add eventClick handler
      >
        <ViewsDirective>
          {['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'].map((item) => (
            <ViewDirective key={item} option={item} />
          ))}
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
      <PropertyPane>
        <table style={{ width: '100%', background: 'white' }}>
          <tbody>
            <tr style={{ height: '50px' }}>
              <td style={{ width: '100%' }}>
                <DatePickerComponent
                  value={selectedDate}
                  showClearButton={false}
                  placeholder="Current Date"
                  floatLabelType="Always"
                  change={change}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
    </div>
  );
};

export default Scheduler;
