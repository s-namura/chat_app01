Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  devise_for :users
  root 'rooms#show'
  get '/show_additionally', to: "rooms#show_additionally"
  resources :messages, only: :create
end
