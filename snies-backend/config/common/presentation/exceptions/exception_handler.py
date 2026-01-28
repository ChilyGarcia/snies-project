from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from continuing_education.domain.exceptions.domain_exception import DomainException

def custom_exception_handler(exc, context):
                                                            
                                         
    response = exception_handler(exc, context)

                                                                   
    if isinstance(exc, DomainException):
        data = {
            "error": exc.message,
            "message": "Validation Error"
        }
                                                                               
        status_code = getattr(exc, 'status_code', status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status_code)

                                                                                                                              
                                                                                                       
    if response is not None:
                                                
        if response.status_code == 400 and isinstance(response.data, (dict, list)):
                                                                          
             return Response({
                 "error": response.data,
                 "message": "Validation Error"
             }, status=status.HTTP_400_BAD_REQUEST)

    return response
