class ImpactController < ApplicationController
  before_action only: :index do
    get_json('impacto')
  end
  
 def index
  evaluate_params(params)
 end


private 

  #Evalua los parametros enviados de la vista (guarda o renderea dependiendo)
  def evaluate_params(params)
    unless params[:savetime].blank?
      save_advance_impact(params[:savetime][:actual],params[:savetime][:clicked])
    end

    unless params[:savedate].blank?
      save_advance_date_impact(params[:savedate][:actual],params[:savedate][:clicked],params[:savedate][:date])
    end

    unless params[:pagetime].blank?    
      next_value = getNext(params[:pagetime][:next],params[:pagetime][:restriction],params[:pagetime][:next_restrictions])
      progreso_de_impacto = get_progress(params[:pagetime][:totals],next_value)
      respond_to do |format|
        if next_value == "-3"
          format.js { render :partial => 'shared/outputs/finish_zonal'}
        elsif next_value == "-2"
          format.js { render :js => "finaliza_impacto_vecinal('normal');"}
        elsif next_value == "-21"
          format.js { render :js => "finaliza_impacto_vecinal('cita');"}
        elsif next_value == "-1"
          format.js { render :js => "finaliza_bajo_impacto();"}
        else    
          format.js { render :js => "hidden_div(#{next_value},#{progreso_de_impacto},0,0);"}
        end
      end
    end
  end

  #regresa el id de la vista que continua
  def getNext(next_val, restriction, next_restriction)
  	if restriction.to_i == -2 && session[:impacto_usuario].to_i == -2 
  		next_restriction
  	else
  		next_val
  	end
  end

end
