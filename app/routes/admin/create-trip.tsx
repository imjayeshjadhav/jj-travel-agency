import { Header } from 'components'
import {ComboBoxComponent} from "@syncfusion/ej2-react-dropdowns";
import type {Route}  from './+types/create-trip'
import { comboBoxItems, selectItems } from '~/constants';
import { cn, formatKey } from 'lib/utils';
import type { Item } from '@syncfusion/ej2-react-navigations';
import {LayerDirective, LayersDirective, MapsComponent} from "@syncfusion/ej2-react-maps";
import { useState } from 'react';
import { world_map } from '~/constants/world_map';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { account } from '~/appwrite/client';

export const loader = async ()=>{
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json()
  
  return data.map((country: any) => ({
    name: country.flag + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }))
}

const CreateTrip = ({loaderData} : Route.ComponentProps) => {

  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault()
    setLoading(true);

    if (
      !formData.country ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget ||
      !formData.groupType 
    ){
      setError('Pleae provide values for all the fields')
      setLoading(false)
      return;
    }

    if(formData.duration<1 || formData.duration>10){
      setError("Duration must be between 1 to 10 days")
      setLoading(false)
      return
    }
    const user = await account.get()
    if (!user.$id){
      console.error('User not authenticated')
      setLoading(false)
      return;
    }

    try{
      console.log('user',user)
      console.log('formData', formData)
    }catch(e){
      console.error('Error generating trip',e);
    }finally{
      setLoading(false)
    }

  }
  

  const handleChange =(key:keyof TripFormData, value :string|number) =>{
    setFormData({...formData,[key]:value})
  }
  const countries = loaderData as Country[]

  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || '',
    travelStyle: '',
    interest: '',
    budget: '',
    duration: 0,
    groupType: ''
});

  const [error, setError] = useState<string | null>(null)
  const [ loading, setLoading] = useState(false) 

    const countryData = countries.map((country)=>({
      text: country.name,
      value: country.value,
    }
    ))

    const mapData = [
        {
            country: formData.country,
            color: '#EA382E',
            coordinates: countries.find((c: Country) => c.name === formData.country)?.coordinates || []
        }
    ]

  return (
    <main className='flex flex-col g10 pb-20 wrapper'>
      <Header 
        title="Add a New Trip"
        description='View and edit AI generated travel plans'
      />
      <section className='mt-[20px] wrapper-md'>
        <form className='trip-form ' onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">
              Country
            </label>
            <ComboBoxComponent
              id="country"
              dataSource = {countryData}
              fields={{text:'text', value:'value'}}
              placeholder="Select a country"
              className='combo-box'
              change ={(e:{value:string | undefined})=>{
                if(e.value){
                  handleChange('country', e.value)
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();

                e.updateData(
                    countries.filter((country) => country.name.toLowerCase().includes(query)).map(((country) => ({
                        text: country.name,
                        value: country.value
                    })))
                )
            }}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input id='duration' 
              name="duration"
              type='number'
              placeholder='Enter number of days'
              className='form-input placeholder:text-gray-100'
              onChange={(e)=>handleChange('duration',Number(e.target.value))}
            />
          </div>
          {
            selectItems.map((key)=>(
              <div key={key}>
                <label htmlFor={key}>
                  {formatKey(key)}
                </label>
                <ComboBoxComponent 
                  id={key}
                  dataSource={comboBoxItems[key].map((item)=>(
                  { text:item,
                    value:item
                  }
                  ))}
                  fields={{text:'text', value:'value'}}
                  placeholder={`Select ${formatKey(key)}`}
                  change={(e: { value: string | undefined }) => {
                    if(e.value) {
                        handleChange(key, e.value)
                    }
                }}
                allowFiltering
                filtering={(e) => {
                    const query = e.text.toLowerCase();

                    e.updateData(
                        comboBoxItems[key]
                            .filter((item) => item.toLowerCase().includes(query))
                            .map(((item) => ({
                                text: item,
                                value: item,
                            }))))}}
                className="combo-box"
                />
              </div>
            ))
          }
          <div>
            <label htmlFor="location">
              Location on the world map
            </label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  dataSource={mapData}
                  shapeData={world_map}
                  shapeDataPath='country'
                  shapePropertyPath="name"
                  shapeSettings={{colorValuePath:'color', fill:'#e5e5e5'}}
                />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className='bg-gray-200 h-px w-full'/>
          {
            error &&(
              <div className='error'>
                <p>{error}</p>
              </div>
            )
          }
          <footer className='px-6 w-full'>
            <ButtonComponent
              type='submit'
              className='button-class !h-12 !w-full' disabled={loading}
            >
              <img src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} className={cn("size-5", {'animate-spin':loading})} />
              <span className='p-16-semibold text-white' >{loading?'Generating...':"Generate Trip"}</span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  )
}

export default CreateTrip
