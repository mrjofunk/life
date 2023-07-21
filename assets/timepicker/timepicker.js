
var dw_time_picker = function(element,container_iframe,dates,mode,onset,onclose,language,weekend_days){

	var self = this;
	        
	// home
	this.timepicker;
	this.container  = $('<tr></tr>');
	this.onset   	= onset;
	this.onclose    = onclose;
	this.closeable  = false;  
	this.element    = element && $.trim(element) != '' ? $(element) : false;

	// element
	if(this.element.length){
		//console.log(element);
		self.timepicker = element;     
		$(self.timepicker).addClass('timepicker element');
		$(self.timepicker).append($('<table class="tp-container"></table>').append(self.container));           
	
	// standart
	}else{     
		self.timepicker = $('<div class="timepicker"></div>').append($('<table class="tp-container"></table>').append(self.container));
		$('body').append(self.timepicker);
	} 
	
	// close click event
   /* this.closeable = false;
	this.onclose   = onclose;   
	$(document).click(function(){
	    if(self.closeable){
	        self.closeable = false;                 
	        if(typeof self.onclose == 'function') self.onclose(self.getDates());
	        $(self.timepicker).removeClass('show');      
	    }
    }); */  
    
    $(self.timepicker).bind('click touchstart',function(e){  
    	 e.stopPropagation();
	});
      
   /* $(self.timepicker).click(function(event){
        event.stopPropagation();
    });
	   */
	this.isArray = function(obj){
		return (Object.prototype.toString.call(obj) === '[object Array]');
	};

	// trigger onset 
	this.triggerOnset = function(){
		if(typeof self.onset == 'function') self.onset(self.getDates());
	}
     
	// parameters
	this.locale = {
		en:{
			MN		:['January','February','March','April','May','June','July','August','September','October','November','December'],
			MNS		:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			DN		:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
			DNS		:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
			FORMAT	:'%Y-%m-%d',
		},
		de:{
			MN		:['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
			MNS		:['Jan','Feb','Mär','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
			DN		:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'],
			DNS		:['Mo','Di','Mi','Do','Fr','Sa','So'],
			FORMAT	:'%d.%m.%Y',
		}, 
		du:{
			MN		:['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'],
			DN		:['Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag','Zondag'],
			FORMAT	:'y-mm-dd',
		},	 
		ru:{
			MN		:['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'],
			MNS		:['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
			DN		:['понедельник','вторник','среда','четверг','пятница','суббота','воскресенье'],
			DNS		:['пон','втр','срд','чет','пят','суб','вск'],
			FORMAT	:'%Y-%m-%d',
		},
		es:{
			MN		:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
			MNS		:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
			DN		:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],
			DNS		:['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
			FORMAT	:'%d/%m/%Y',
		}, 
	}; 
	this.mode 		  = mode && $.trim(mode) != '' ? mode : 'datetimerange'; // date, daterange, datetime, datetimerange, time, timerange
	this.weekend_days = weekend_days != undefined && self.isArray(weekend_days) ? weekend_days : [5,6]; 
	this.language 	  = self.locale[language] ? language : 'de';
	this.calendars 	  = [{date:new Date(),selected:false,view:'month',container:$('<td class="picker" valign="top"></td>')}]; // single  
	
	// on range mode add another
	if(self.mode.indexOf('range') != -1){
		self.calendars.push({date:new Date(),selected:false,view:'month',container:$('<td class="picker" valign="top"></td>')});
	}
   
	// setter
	this.setDates = function(obj){ 
        //console.log(obj)
		// make an array out of objects
		if(!self.isArray(obj)) obj = new Array(obj);
		    
		// if two dates are coming in
		while(obj.length > self.calendars.length){
			self.calendars.push({date:new Date(),selected:false,view:'month',container:$('<td class="picker" valign="top"></td>')}); 
		} 
     
		// set date 
		var i=0;
		for(var key in obj){

			// if datestrings like from sql ar comming in, try to convert it 
			if(!(obj[key] instanceof Date) && (typeof obj[key] === 'string')) obj[key] = self.sqlDateTimeToDateObject(obj[key]);
			
		    // set calendar date
		    if(obj[key]) self.calendars[i].date = new Date(obj[key].getTime());
			
			// none is defualt
			self.calendars[i].selected = obj[key] ? new Date(obj[key].getTime()) : false;
			  
			/*if(obj[key].year != undefined){
				self.calendars[i].date.setFullYear(obj[key].year);
				if(!self.calendars[i].selected) self.calendars[i].selected = new Date();
				self.calendars[i].selected.setFullYear(obj[key].year);
			}
			if(obj[key].month != undefined){
				self.calendars[i].date.setMonth(obj[key].month-1);
				if(!self.calendars[i].selected) self.calendars[i].selected = new Date();
				self.calendars[i].selected.setMonth(obj[key].month-1);
			}
			if(obj[key].day != undefined){
				self.calendars[i].date.setDate(obj[key].day);
				if(!self.calendars[i].selected) self.calendars[i].selected = new Date();
				self.calendars[i].selected.setDate(obj[key].day);
			}
			if(obj[key].hours != undefined){
				self.calendars[i].date.setHours(obj[key].hours);
				if(!self.calendars[i].selected) self.calendars[i].selected = new Date();
				self.calendars[i].selected.setHours(obj[key].hours);
			}
			if(obj[key].minutes != undefined){
				self.calendars[i].date.setMinutes(obj[key].minutes); 
				if(!self.calendars[i].selected) self.calendars[i].selected = new Date();
				self.calendars[i].selected.setMinutes(obj[key].minutes);
			}
			if(obj[key].seconds != undefined){
				self.calendars[i].date.setSeconds(obj[key].seconds);
				if(!self.calendars[i].selected) self.calendars[i].selected = new Date();
				self.calendars[i].selected.setSeconds(obj[key].seconds);
			}
			if(obj[key].milliseconds != undefined){
				self.calendars[i].date.setMilliseconds(obj[key].milliseconds);
				if(!self.calendars[i].selected) self.calendars[i].selected = new Date();
				self.calendars[i].selected.setMilliseconds(obj[key].milliseconds);
			}*/
			i++;  
		} 
		
		self.renderAll();
	};
	
	// getter
	this.getDates = function(){ 
	    var dates = [];
	    for(var i in self.calendars){ 
	        dates.push(self.calendars[i].selected ? new Date(self.calendars[i].selected.getTime()) : false);
	    }
	    return dates;
	}; 
	
	this.hide = function(){
	    if(typeof self.onclose == 'function') self.onclose(self.getDates());
    	$(self.timepicker).removeClass('show'); 
	}
	
	this.show = function(e){
		if(e) e.stopPropagation();

		$(self.timepicker).removeClass('show').addClass('show');
		
		// with element, there is no overlay needet
		if(self.element.length) return;
		
	    // overlay
		$('body').append($('<div style="position:absolute;top:0px;left:0px;z-index:9999999;height:100%; width:100%; background-color:rgba(0,0,0,0.1);"></div>').bind('click touchstart',function(e){  
			$(e.target).remove();
			self.hide();
		}));
		
		// coords to show
		var coords = {x:0,y:0};
	   
	    // wenn ein event geliefert wird, position übernehmen
	    if(e){
	        coords.x = e.target.offsetLeft;
            coords.y = e.pageY - e.target.offsetTop; 
                 
            // wenn ein container geliefert wird, position übernehmen 
            if(container_iframe){ 
                var cont = $(container_iframe);
                var offset = cont.length ? cont.offset() : {top:0,left:0};
                coords.x += offset.left;
                coords.y += offset.top;      
            } 
	    } 

		// platz prüfen
		var picker  	= self.timepicker;
		var container 	= $('body');
		if(coords.x + picker.width() > container.width()){
			coords.x = container.width() - picker.width() - 30;
			if(container.width() < picker.width()) coords.x = (container.width() - picker.width()) / 2;
		}
		if(coords.y + picker.height() > container.height()){
			coords.y = container.height() - picker.height() - 30;
			if(container.height() < picker.height()) coords.y = (container.height() - picker.height()) / 2;
		}
		
        self.timepicker.css({
            top :coords.y+'px',
            left:coords.x+'px'
        })
		
		
		
		
	   // window.setTimeout(function(){ self.closeable = true; },50);  
	};
	
	// renderAll
	this.renderAll = function(num){
		
		// clear div
		$(self.container).empty();
		
		// set num
		num = num || 0;
		 
		// add mun containers first    
		$(self.container).append(self.calendars[num].container);
		          
		// renderAll mode
		if(self.calendars[num].view == 'month'){
		   	self.renderMonthView(num); 
		}else{
		    self.renderYearView(num);   
		}
		
		// add the downwards
		for(var i=num-1 ; i>=0 ; i--){  
			
			// add containers
			$(self.container).prepend(self.calendars[i].container); 
			
			// renderAll mode
			if(self.calendars[i].view == 'month'){
			   	self.renderMonthView(i); 
			}else{
			    self.renderYearView(i);   
			}
		}
		
		// add the downwards
		for(var i=num+1 ; i<self.calendars.length ; i++){  
			    
			// add containers
			$(self.container).append(self.calendars[i].container); 
			
			// renderAll mode
			if(self.calendars[i].view == 'month'){
			   	self.renderMonthView(i); 
			}else{
			    self.renderYearView(i);   
			}
		}
	};

	this.renderMonthView = function(num){ 
	    
	 	// get current calendar
		num = parseInt(num,10);
		var calendar = self.calendars[num]; 
		
		// chach date range lock
		if(self.rangeLock(num)) return true;
		
		// empty container
		$(calendar.container).empty();
		 
		// array for footer
		var footer_buttons = [];
                 
		// create new table 
		if(self.mode.indexOf('date') != -1){ 
			var table  = $('<table class="tp-month"></table>');
			var months = self.locale[self.language].MN;
			var days   = self.locale[self.language].DNS;    
			var week   = []; 
		
			var d = new Date(calendar.date.getFullYear(),calendar.date.getMonth()+1,0);        
			var days_of_months = d.getDate();    
		
			// buttonbar
			table.append(
				$('<tr class="tp-buttonbar"></tr>')
					.append($('<td class="tp-button"><div class="arrow-left"></div></td>').on('click',function(){ 
						calendar.date.setMonth(calendar.date.getMonth()-1); 
						self.renderMonthView(num); 
					}))
			    	.append($('<td colspan="'+(days.length-2)+'">'+months[calendar.date.getMonth()]+' '+calendar.date.getFullYear()+'</td>').on('click',function(){ 
						calendar.view = 'year'; 
						self.renderYearView(num); 
					})) 
					.append($('<td class="tp-button"><div class="arrow-right"></div></td>').on('click',function(){ 
						calendar.date.setMonth(calendar.date.getMonth()+1); 
						self.renderMonthView(num); 
					}))  
			); 

			// header
			var header = $('<tr class="tp-header"></tr>');
		    for(var i=0 ; i<days.length ; i++){
				var day_of_week_title = days[i].substr(0,3);
				if(days) day_of_week_title = days[i]; 
				header.append($(self.tdHTMLFor(i,day_of_week_title)));
		    }
			table.append(header);

			// tage 
			// --------------------------------------------------------------
		
			for(var day=1 ; day<=days_of_months ; day++){  

				// datum erzeugen
				var day_date = new Date(calendar.date.getFullYear(),calendar.date.getMonth(),parseInt(day,10));

				// wochentag
				var day_of_week_num   = day_date.getDay() == 0 ? days.length-1 : day_date.getDay()-1;
				var day_of_week_title = days[day_of_week_num].substr(0,1);

				// zu beginn des monats woche auffüllen wenn nötig  
				if(day == 1){
					while(week.length < day_of_week_num){
					   	week.push($(self.tdHTMLFor(week.length)));
					}
				}
			     
			    var styles = ['tp-over']; 
			
				// selected
				if(
					calendar.selected &&
					day_date.getFullYear() == calendar.selected.getFullYear() &&
					day_date.getMonth() == calendar.selected.getMonth() &&
					day_date.getDate() == calendar.selected.getDate()
				){
				    styles.push('selected'); 
				    
					// rage style   
					if(self.mode.indexOf('range') != -1 ){
						if(num == 0) styles.push('range first'); 
						if(num == self.calendars.length-1) styles.push('range last');
					}
				} 
				
				// rage style
				if(
					calendar.selected && 
					self.mode.indexOf('range') != -1
				){
					// find first selected
					for(var i=0 ; i<num ; i++){
						if(self.calendars[i].selected){
							var idate   		= self.calendars[i].selected;  
							var current_check 	= parseInt(calendar.selected.getFullYear()+''+self.pad(calendar.selected.getMonth(),2)+''+self.pad(calendar.selected.getDate(),2),10);
							var day_check 		= parseInt(day_date.getFullYear()+''+self.pad(day_date.getMonth(),2)+''+self.pad(day_date.getDate(),2),10);
							var idate_check 	= parseInt(idate.getFullYear()+''+self.pad(idate.getMonth(),2)+''+self.pad(idate.getDate(),2),10);
							if(
								day_check <= current_check &&
								day_check >= idate_check
							){
								styles.push('range'); 
								if(day_check == idate_check || day == 1) styles.push('first'); 
							}
							break;
						};
					} 
               
					// find last selected
					for(var i=self.calendars.length-1 ; i>num ; i--){ 
						if(self.calendars[i].selected){
						   	var idate   		= self.calendars[i].selected;  
							var current_check 	= parseInt(calendar.selected.getFullYear()+''+self.pad(calendar.selected.getMonth(),2)+''+self.pad(calendar.selected.getDate(),2),10);
							var day_check 		= parseInt(day_date.getFullYear()+''+self.pad(day_date.getMonth(),2)+''+self.pad(day_date.getDate(),2),10);
							var idate_check 	= parseInt(idate.getFullYear()+''+self.pad(idate.getMonth(),2)+''+self.pad(idate.getDate(),2),10);
							if(
								day_check >= current_check &&
								day_check <= idate_check
							){
								styles.push('range');     
								if(day_check == idate_check || day == days_of_months) styles.push('last');    
							}
							break;  
						} 
					} 
				}

				// tag einfügen 
				week.push($(self.tdHTMLFor(day_of_week_num,day,styles)).on('click',function(){
					var isdate = calendar.selected;
					if(!isdate) calendar.selected = new Date();
					calendar.selected.setFullYear(calendar.date.getFullYear());
					calendar.selected.setMonth(calendar.date.getMonth());
					calendar.selected.setDate(parseInt($(this).text(),10));
					if(!isdate) calendar.selected.setHours(0);
					if(!isdate) calendar.selected.setMinutes(0);
					if(!isdate) calendar.selected.setSeconds(0);
					if(!isdate) calendar.selected.setMilliseconds(0);
					
					// if in range mode
					if(self.mode.indexOf('range') != -1){
						self.renderAll(num); 

						// trigger onset 
						self.triggerOnset();

				   	// normal mode
					}else{
						self.renderMonthView(num);   
					}
					
				}));

				// wenn sonntag
				if(day_date.getDay() == 0){
					table.append($('<tr></tr>').append(week));
					week = [];
				}
			} 

			// übrige tage der letzten woche hinzufügen
			if(week.length > 0){

				// woche zu ende füllen
			 	while(week.length < 7){
				   	week.push($(self.tdHTMLFor(week.length)));
				}  

				// hinzufügen 
				table.append($('<tr></tr>').append(week));
				week = [];	
			}
			
			// set content 
		    $(calendar.container).append(table); 
		
			// footer button totday   
			footer_buttons.push(
				$('<td></td>') 
	   			.append($('<span>Heute</span>').on('click',function(){ 
					calendar.date = new Date(); 
					calendar.selected = new Date(); 
					calendar.selected.setHours(0);
					calendar.selected.setMinutes(0);
					calendar.selected.setSeconds(0);
					calendar.selected.setMilliseconds(0);
					
					// if in range mode
					if(self.mode.indexOf('range') != -1){
						self.renderAll(num); 

				   	// normal mode
					}else{
						self.renderMonthView(num);   
					}

					// trigger onset 
					self.triggerOnset();
				}))  
			);   
		}
		
		// time mode
		// --------------------------------------------------------------
        
		if(self.mode.indexOf('time') != -1){
			var time  = '--:--';
			if(calendar.selected) time = self.pad(calendar.selected.getHours(),2)+':'+self.pad(calendar.selected.getMinutes(),2); 
			var canvas = $('<canvas><canvas>');
			var time   = $('<input type="tp-time" value="'+time+'" '+(!calendar.selected ? 'disabled' : '')+'/>').on('change mouseup keyup',function(event){ 
				
				// store the element 
				var element = $(this);
				
				// on key up wait until the user finishes the input
				if(event.type == 'keyup'){
					 self.timeout = window.setTimeout(function(){action();},1000);
				}else{
					 action();
				}
				
				// action
				function action(){
					if(!calendar.selected){  
					   	$(element).val('--:--');
						return; 
					}	
					var values = $(element).val().split(':'); 
					if($.trim($(element).val()) == ''){
						values = [0,0];
						$(element).val('00:00');   
					}
					if(
						values.length > 1 && 
						!isNaN(parseInt(values[0],10)) && 
						!isNaN(parseInt(values[1],10))
					){ 
						calendar.selected.setHours(parseInt(values[0],10));
						calendar.selected.setMinutes(parseInt(values[1],10));
						calendar.selected.setSeconds(0);
					}

					// chach date range lock
					if(self.rangeLock(num,true)) return true;

					// update
					self.updateClock(num);
				}  
			}); 
			$(calendar.container).append($('<table class="tp-time"></table>')
				.append($('<tr></tr>')
					.append($('<td align="center"></td>').append(canvas))	
					.append($('<td align="center"></td>').append(time)) 
				)
			);

			// set content 
			self.updateClock(num); 
			
			// footer button now   
			footer_buttons.push(
				$('<td></td>')
	   			.append($('<span>Jetzt</span>').on('click',function(){ 
					calendar.date = new Date(); 
					calendar.selected = new Date(); 
					
					// if in range mode
					if(self.mode.indexOf('range') != -1){
						self.renderAll(num); 

				   	// normal mode
					}else{
						self.renderMonthView(num);   
					}

					// trigger onset 
					self.triggerOnset();
			 	}))  
			);
		}
 
		// footer 
		// --------------------------------------------------------------
		
		// none
		footer_buttons.push(
			$('<td></td>') 
			.append($('<span>Unbekannt</span>').on('click',function(){ 
			 	calendar.selected = false;
			 
				// if in range mode
				if(self.mode.indexOf('range') != -1){
					self.renderAll(num); 

			   	// normal mode
				}else{
					self.renderMonthView(num);   
				}

				// trigger onset 
				self.triggerOnset();
		 	}))  
		);

		// set content  
		$(calendar.container).append($('<table class="tp-footer"></table>')
		 	.append($('<tr></tr>')
				.append(footer_buttons)
			)
		);   	
	};
	
	this.renderYearView = function(num){
        
		// get current calendar 
		num = parseInt(num,10);
		var calendar = self.calendars[num];

		// create new table 
		var table = $('<table class="tp-year"></table>');
		var row   = []; 
		
		// buttonbar
		table.append(
			$('<tr class="tp-buttonbar"></tr>')
				.append($('<td class="tp-button"><div class="arrow-left"></div></td>').on('click',function(){ 
					calendar.date.setFullYear(calendar.date.getFullYear()-12); 
					self.renderYearView(num); 
				}))
		    	.append($('<td colspan="2">'+(calendar.date.getFullYear()-4)+' - '+(calendar.date.getFullYear()+7)+'</td>').on('click',function(){ 
					calendar.view = 'month'; 
					self.renderMonthView(num);   
				})) 
				.append($('<td class="tp-button"><div class="arrow-right"></div></td>').on('click',function(){ 
					calendar.date.setFullYear(calendar.date.getFullYear()+12); 
					self.renderYearView(num);   
				}))  
		); 

		// jahre
		for(var year=calendar.date.getFullYear()-4 ; year<=calendar.date.getFullYear()+7 ; year++){  
             
			// selected
			var styles = ['tp-over'];
			if(
				calendar.selected &&
				year == calendar.selected.getFullYear()
			){
			    styles.push('selected');     	
			}

			row.push($(self.tdHTMLFor(-1,year,styles)).on('click',function(){ 
				calendar.view = 'month'; 
				calendar.date.setFullYear(parseInt($(this).text(),10)); 
				self.renderMonthView(num);  
			}));

			// wenn sonntag
			if(row.length >= 4){
				table.append($('<tr></tr>').append(row));
				row = [];
			}
		} 
       
		// set content 
	    $(calendar.container).empty().append(table);
	};

	this.updateClock = function(num){ 
		
		// get current calendar
		num = parseInt(num,10);
		var calendar = self.calendars[num];

		var canvas  = $(calendar.container).find('canvas');
		var ctx 	= $(canvas).get(0).getContext('2d');   
		var width 	= $(canvas).width();
		var height 	= $(canvas).height();
		var half	= width/2;
        
		ctx.canvas.width = width;
        ctx.canvas.height = height;

		ctx.save();
		ctx.clearRect(0,0,width,height);
		ctx.translate(width/2,height/2);
		ctx.scale(1,1);
		ctx.rotate(-Math.PI/2);
		ctx.fillStyle = "white";
		ctx.lineCap = "round";

		// Hour marks 
		ctx.save(); 
		ctx.strokeStyle = "black"; 
		ctx.lineWidth = (half*0.05);
		for (var i=0;i<12;i++){
			ctx.beginPath();
			ctx.rotate(Math.PI/6);
			ctx.moveTo(half-(half*0.15),0);
			ctx.lineTo(half-(ctx.lineWidth/2),0);
			ctx.stroke();
		}
		ctx.restore();
		
		// Minute marks
		ctx.save();
		ctx.strokeStyle = "grey";  
		ctx.lineWidth = (half*0.03);  
		for (i=0;i<60;i++){
			if (i%5!=0) {
				ctx.beginPath();
				ctx.moveTo(half-(ctx.lineWidth*2),0);
				ctx.lineTo(half-(ctx.lineWidth/3),0);
				ctx.stroke();
			}
			ctx.rotate(Math.PI/30);
		}
		ctx.restore();
        
		// onliy with date
		if(calendar.selected){
			
			var sec = calendar.selected.getSeconds();
			var min = calendar.selected.getMinutes();
			var hr  = calendar.selected.getHours(); 
			
			$(calendar.container).find('input').val(self.pad(hr,2)+':'+self.pad(min,2));  
			
			hr = hr>=12 ? hr-12 : hr;

			ctx.fillStyle   = "black";
	        ctx.strokeStyle = "black";  

			// write Hours
			ctx.save();
			ctx.rotate( hr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec );
			ctx.lineWidth = (half*0.07);
			ctx.beginPath();
			ctx.moveTo(-(half*0.15),0);
			ctx.lineTo(half-(half*0.4),0);
			ctx.stroke();
			ctx.restore();

			// write Minutes
			ctx.save();
			ctx.rotate((Math.PI/30)*min + (Math.PI/1800)*sec);
			ctx.lineWidth = (half*0.05);   
			ctx.beginPath();
			ctx.moveTo(-(half*0.2),0);
			ctx.lineTo(half-(ctx.lineWidth*2),0);
			ctx.stroke();
			ctx.restore();

			// Write seconds
			/*ctx.save();
			ctx.rotate(sec * Math.PI/30);
			ctx.strokeStyle = "#D40000";
			ctx.fillStyle = "#D40000";
			ctx.lineWidth = (half*0.02);
			ctx.beginPath();
			ctx.moveTo(-(half*0.25),0);
			ctx.lineTo(half-(ctx.lineWidth*5),0);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(0,0,(half*0.05),0,Math.PI*2,true);
			ctx.fill();
			//ctx.beginPath();
			//ctx.arc(95,0,10,0,Math.PI*2,true);
			//ctx.stroke();
			//ctx.fillStyle = "rgba(0,0,0,0)";
			//ctx.arc(0,0,3,0,Math.PI*2,true);
			//ctx.fill(); 
			ctx.restore();
	        */
			/*
			ctx.beginPath();
			ctx.lineWidth = 14;
			ctx.strokeStyle = '#325FA2';
			ctx.arc(0,0,142,0,Math.PI*2,true);
			ctx.stroke();
			ctx.restore();
			*/
		}
	};
	
	this.rangeLock = function(num,timeOnly){
		
		// get current calendar 
		num = parseInt(num,10);
		var calendar = self.calendars[num];
		var render = false;
		
		// when in range mode
		if(
			calendar.selected &&   
			self.mode.indexOf('range') != -1
		){
			// the calendar befor can't have a date in the future 
			for(var i=(num-1) ; i>=0 ; i--){
			   	if(
					self.calendars[i] && 
					self.calendars[i].selected &&
					calendar.selected < self.calendars[i].selected  
				){
					self.calendars[i].selected.setFullYear(calendar.selected.getFullYear());
					self.calendars[i].selected.setMonth(calendar.selected.getMonth());
					self.calendars[i].selected.setDate(calendar.selected.getDate());

					// if still not right overtake time too
					if(calendar.selected < self.calendars[i].selected){
						self.calendars[i].selected = new Date(calendar.selected.getTime());  
					}

					self.calendars[i].date = new Date(self.calendars[i].selected.getTime()); 
					render = true; 
				} 
			}

			// the calendar after can't have a date in the past 
			for(var i=(num+1) ; i<self.calendars.length ; i++){  
				if(
					self.calendars[i] &&
					self.calendars[i].selected && 
					calendar.selected > self.calendars[i].selected  
				){
					self.calendars[i].selected.setFullYear(calendar.selected.getFullYear());
					self.calendars[i].selected.setMonth(calendar.selected.getMonth());
					self.calendars[i].selected.setDate(calendar.selected.getDate());
				
					// if still not right overtake time too
					if(calendar.selected > self.calendars[i].selected){ 
					   	self.calendars[i].selected = new Date(calendar.selected.getTime());    
					}
				
					self.calendars[i].date = new Date(self.calendars[i].selected.getTime());
					render = true;  
				}
			} 
            
            if(render){
				
				// all
				if(!timeOnly){
					self.renderAll(num);    
				
				// clocks in month mode only  
				}else if(self.mode.indexOf('time') != -1){  
					for(var i in self.calendars){  
						if(self.calendars[i].view == 'month'){ 
						   	self.updateClock(i); 
						}
					}
				}

				return true;
			}
		}
		
		return false;
	};

	// td html 
	this.tdHTMLFor = function(day_of_week,value,styles){

		// protect value
		if(!value || value == '') value = '&nbsp;';

		// styles 
		styles = styles || [];

		// weekend days
		if(self.isWeekend(day_of_week)) styles.push('weekend');      

		// return tag
		return '<td class="'+styles.join(' ')+'"><div>'+value+'</div></td>';
	};

	this.isWeekend = function(day_of_week){
		for(var w=0 ; w<self.weekend_days.length ; w++){
			if(day_of_week == self.weekend_days[w]){
			   	return true;
			}
		}
		return false;
	};

	this.pad = function(str,max){
	  	str = str.toString();
	  	return str.length < max ? self.pad("0" + str, max) : str;
	}; 
	
	// convert date string like datetime from sql into date object
	this.sqlDateTimeToDateObject = function(string){ 
		if(string != null && string != '0000-00-00 00:00:00' && string != '0000-00-00' && string != '00:00:00'){
			var t = string.split(/[- :]/); // split timestamp into [Y,M,D,h,m,s]
			if(t.length >= 6){
				return new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
			}else if(t.length >= 2){
				return new Date(t[0], t[1]-1, t[2]);
			}
		}    
		return false;   
	};

	this.dateObjectToAttribute = function(date){
		if(!date) return 'false';
		return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
	};

	
	this.dateObjectToSqlDateTime = function(date){
		if(!date) return '00000-00-00 00:00:00';
		return date.getFullYear()+'-'+self.pad(date.getMonth()+1,2)+'-'+self.pad(date.getDate(),2)+' '+self.pad(date.getHours(),2)+':'+self.pad(date.getMinutes(),2)+':'+self.pad(date.getSeconds(),2);
	};



	this.dateObjectsToHtmlValue = function(obj,format){ 
		var result = [];  
		if(obj.length > 1 && !obj[0] && !obj[1]) return 'Unbekannt - Unbekannt';
		for(var i in obj){ 
			
			// immer
		    result[i] = 'Unbekannt';

			// add date
			if(obj[i]){

				// is still a string, try to get a date
				if(typeof obj[i] === 'string' && Date.parse(obj[i])) obj[i] = new Date(obj[i]); 
		
				// if we have a date object 
				if(typeof obj[i].getMonth === 'function'){
					result[i] = obj[i].getDate()+'. '+self.locale['de'].MNS[obj[i].getMonth()]+' '+obj[i].getFullYear();
			
					// add time
					if(!format || format == 'datetime') result[i] += ' '+self.pad(obj[i].getHours(),2)+':'+self.pad(obj[i].getMinutes(),2); 
				}
			}
		}
		return result.join(' - ');
	}; 
	
	// if dates are set
	if(dates) self.setDates(dates);
};
