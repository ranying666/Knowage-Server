/*
 * Knowage, Open Source Business Intelligence suite
 * Copyright (C) 2016 Engineering Ingegneria Informatica S.p.A.
 * 
 * Knowage is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Knowage is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package it.eng.spagobi.events;

import it.eng.spago.error.EMFUserError;
import it.eng.spago.security.IEngUserProfile;
import it.eng.spagobi.commons.bo.UserProfile;
import it.eng.spagobi.events.bo.EventLog;
import it.eng.spagobi.events.dao.EventLogDAOHibImpl;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

/**
 * This class menage SpagoBI Event System
 * 
 * @author Gioia
 * 
 * TODO add logging
 */
public class EventsManager {
	
	public static final String DEFAULT_EVENT_PRESENTAION_HANDLER_CLASS_NAME = "it.eng.spagobi.events.handlers.DefaultEventPresentationHandler";
	static private Logger logger = Logger.getLogger(EventsManager.class);
	
	
	/**
	 *  Singleton design pattern
	 */
	private static EventsManager instance = null;
	
	/**
	 * Gets the single instance of EventsManager.
	 * 
	 * @return single instance of EventsManager
	 */
	public static EventsManager getInstance(){
		if(instance == null) instance = new EventsManager();
		return instance;
	}
		
	private EventsManager() {
	}
	
	

	
	/**
	 * Associate an handler to the given event. Every time an event is fired all the handlers
	 * associteted to it are executed by the EventManager.
	 * 
	 * To be implemented ....
	 * 
	 * @param id the event unique id to which the handler is associated
	 * @param handler the handler to execute when the event is fired
	 * 
	 * TODO decide EventHandler interface
	 * TODO decide EventHandler execution order policy
	 * TODO implement some default EventHandler (i.e. NotificationHandler, HousekeepingHandler, ecc...)
	 */
	public void registerHandler(long id, Object handler) {
		
	}
	

	
	/**
	 * Register event.
	 * 
	 * @param user the user
	 * @param desc the desc
	 * @param params the params
	 * @param roles the roles
	 * 
	 * @return the integer
	 */
	public Integer registerEvent(String user, String desc, String params, List roles) {
		return registerEvent(user, desc, params, roles, EventsManager.DEFAULT_EVENT_PRESENTAION_HANDLER_CLASS_NAME);
	}
	
	/**
	 * Register an event given its user name, description and parameters.
	 * 
	 * @param user The user who generated the event
	 * @param desc a description provided by the agent
	 * @param params parameters provided by the agent (usefull for the handlers configuration)
	 * @param handler The presentation class (implementing <code>it.eng.spagobi.events.handlers.IEventPresentationHandler</code>) for the event
	 * @param roles the roles
	 * 
	 * @return the integer
	 */
	public Integer registerEvent(String user, String desc, String params, List roles, String handler) {	
		logger.debug("IN");
		Integer id = null;
		EventLog eventLog = new EventLog();
		eventLog.setUser(user);
		eventLog.setDesc(desc);
		eventLog.setDate(new Timestamp(System.currentTimeMillis()));
		eventLog.setParams(params);
		eventLog.setHandler(handler);
		eventLog.setRoles(roles);
		try {
			EventLogDAOHibImpl eventLogDAO = new EventLogDAOHibImpl();
			eventLogDAO.setUserID(user);
			id = eventLogDAO.insertEventLog(eventLog);
		} catch (EMFUserError e) {
			logger.error("Error while registering event generated by user '" + user + "' at " + eventLog.getDate().toString() + " with decription " + desc, e);
		}
		logger.debug("OUT");
		return id;
	}
	

	
	/**
	 * Get registered event with the id specified at input.
	 * 
	 * @param id The id of the registered event
	 * 
	 * @return The EventLog object with the id specified at input
	 */
	public EventLog getRegisteredEvent(Integer id) {
		logger.debug("IN");
		EventLog event = null;
		try {
			EventLogDAOHibImpl eventLogDAO = new EventLogDAOHibImpl();
			event = eventLogDAO.loadEventLogById(id);
		} catch (EMFUserError e) {
			logger.error("The event with id = " + id + " was not found.", e);
		}
		logger.debug("OUT");
		return event;
	}
	
	/**
	 * Get the list of registered events (generated by the user at input) ordered by date.
	 * 
	 * @param profile the profile
	 * 
	 * @return The list of events generated by the user
	 */
	public List getRegisteredEvents(IEngUserProfile profile) {
		logger.debug("IN");
		List registeredEventsList = null;
		try {
			EventLogDAOHibImpl eventLogDAO = new EventLogDAOHibImpl();
			registeredEventsList = eventLogDAO.loadEventsLogByUser(profile);
		} catch (EMFUserError e) {
			logger.error("Error while loading events list for the user '" + ((UserProfile)profile).getUserId().toString(), e);
		}
		logger.debug("OUT");
		return registeredEventsList;
	}
	
	/**
	 * Gets the params str.
	 * 
	 * @param params the params
	 * 
	 * @return the params str
	 */
	public static String getParamsStr(Map params) {
		logger.debug("IN");
		StringBuffer buffer = new StringBuffer();
		Iterator it = params.keySet().iterator();
		boolean isFirstParameter = true;
		while(it.hasNext()) {
			String pname = (String)it.next();
			String pvalue = (String)params.get(pname);
			if(!isFirstParameter) buffer.append("&");
			else isFirstParameter = false;
			buffer.append(pname + "=" + pvalue);
		}
		logger.debug("OUT");
		return buffer.toString();
	}
	
	/**
	 * Parses the params str.
	 * 
	 * @param str the str
	 * 
	 * @return the map
	 */
	public static Map parseParamsStr(String str) {
		logger.debug("IN");
		Map params = new HashMap();
		String[] parameterPairs = str.split("&");
		for(int i = 0; i < parameterPairs.length; i++) {
			String[] chunks = parameterPairs[i].split("=");
			params.put(chunks[0], chunks[1]);
		}
		logger.debug("OUT");
		return params;
	}
}
