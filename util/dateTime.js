module.exports = {
    format: (timestamp) => {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        
        const dateTime = new Date(timestamp);
        const dateTimeHour = dateTime.getHours();
        const dateTimeMinute = dateTime.getMinutes();

        const day = days[dateTime.getDay()];
        const date = `${months[dateTime.getMonth()]} ${dateTime.getDate()}, ${dateTime.getFullYear()}`;
        
        const hour = dateTimeHour < 10 ? `0${dateTimeHour}` : dateTimeHour;
        const minute = dateTimeMinute < 10 ? `0${dateTimeMinute}` : dateTimeMinute;
        const time = `${hour}:${minute}`;
        
        return `${day}, ${date} @ ${time}`;
    }
};