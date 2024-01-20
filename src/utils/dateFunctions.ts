//The function converts date format to a human readable date
function formatDate(inputDateString: string): string {
    const inputDate = new Date(inputDateString);
    
    if (isNaN(inputDate.getTime())) {
      // Handle invalid date string
      return 'Invalid Date';
    }
  
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
  
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(inputDate);
    return formattedDate;
  }

export default formatDate