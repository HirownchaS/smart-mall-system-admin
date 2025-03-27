import React, { useState } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import axios from 'axios';
import { scheduleData } from '../data/dummy';
import { Header } from '../components';

const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Scheduler = () => {
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [scheduleObj, setScheduleObj] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now())); // State to store selected date

  const change = (args) => {
    const newDate = args.value;
    setSelectedDate(newDate);
    scheduleObj.selectedDate = newDate;
    scheduleObj.dataBind();
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


  //   event create function
  const createEvent = async (event) => {
    setIsLoadingAction(true);
    try {
      const url = "http://localhost:8080/api/event/create";
      const response = await axios.post(url, event);
      if (response.status === 201) {
        console.log("Successfully created", response);
      }
    } catch (error) {
      console.log("Error while create event,", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  //   event update function
  const updateEvent = async (event) => {
    setIsLoadingAction(true);
    try {
      const url = `http://localhost:8080/api/event/update/${event.Id}`;
      const response = await axios.put(url, event);
      if (response.status === 200) {
        console.log("Successfully updated", response);
      }
    } catch (error) {
      console.log("Error while update event,", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  //   event delete function
  const deleteEvent = async (event) => {
    setIsLoadingAction(true);
    try {
      const url = `http://localhost:8080/api/event/delete/${event.Id}`;
      const response = await axios.delete(url);
      if (response.status === 204) {
        console.log("Successfully deleted", response);
      }
    } catch (error) {
      console.log("Error while delete event,", error);
    } finally {
      setIsLoadingAction(false);
    }
  };


  //   event actions
  const onActionComplete = async (args) => {
    if (args.requestType === "eventCreated") {
      await createEvent(args.addedRecords[0]);
    }

    if (args.requestType === "eventChanged") {
      await updateEvent(args.changedRecords[0]);
    }

    if (args.requestType === "eventRemoved") {
      await deleteEvent(args.deletedRecords[0]);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        height="650px"
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={selectedDate}
        eventSettings={{ dataSource: scheduleData }}
        actionComplete={onActionComplete}
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
