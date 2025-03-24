import * as React from "react";
import { useEffect, useState } from "react";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import axios from "axios";

const NewCalendar = () => {
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const [eventSettings, setEventSettings] = useState({ dataSource: [] });
  const [currentView, setCurrentView] = useState("Week");

  //   events fetching function
  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const url = `http://localhost:8080/api/event/events`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setEventSettings({ dataSource: response?.data });
      }
    } catch (error) {
      console.log("Error while fetching events,", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  //  calling events fetching function
  useEffect(() => {
    fetchEvents();
  }, []);

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
    <div className="schedule-control-section">
      <div className="col-lg-12 control-section">
        <div className="control-wrapper">
          <ScheduleComponent
            height="650px"
            selectedDate={new Date(2021, 0, 10)}
            eventSettings={eventSettings}
            actionComplete={onActionComplete}
            currentView={currentView}
          >
            <Inject
              services={[
                Day,
                Week,
                WorkWeek,
                Month,
                Agenda,
                Resize,
                DragAndDrop,
              ]}
            />
          </ScheduleComponent>
        </div>
      </div>
    </div>
  );
};
export default NewCalendar;