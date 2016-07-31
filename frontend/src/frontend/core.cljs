(ns frontend.core
  (:require [reagent.core :as reagent :refer [atom]]))

(enable-console-print!)

(println "This text is printed from src/frontend/core.cljs. Go ahead and edit it and see reloading in action.")

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {:text "Testing!"}))

(defn another-component [color size] 
  [:div
    [:h3 {:style {:color color :font-size size}} "Bus stops go here."]
  ])

(defn hello-world []
  ;[:h1 (:text @app-state)])
  [:div 
    [:h2 "Cool Man it works awesomely"]
    [:p  "Now we're really on to something."]
    (map (fn [a] (another-component "pink" (str a "px"))) [20 25 30 35])
    [another-component "yellow" "20px"]
  ])

(reagent/render-component [hello-world]
 
                          (. js/document (getElementById "app")))
(def jq (js* "$"))
(def Map (js* "google.maps.Map"))

(jq (fn [] (-> (jq "#test")
               (.html "wow man it works here too"))))

(println Map)

(def map-options (js* "{zoom: 17,
	    	                center: new google.maps.LatLng(44.389192,-79.688208),
                        mapTypeId: google.maps.MapTypeId.ROADMAP}"))

(def lat-lng (js/google.maps.LatLng. 44.389 -79.688))

(def map-opts (js-obj "zoom" 16
                      "center" lat-lng
                      "mapTypeId" (.-ROADMAP google.maps.MapTypeId )))

(Map. (. js/document (getElementById "map")) map-opts)

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  (swap! app-state update-in [:__figwheel_counter] inc)
)
