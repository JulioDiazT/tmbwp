// src/pages/VolunteeringFormPage.tsx
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'

type FormData = {
  name: string
  email: string
  position: string
  message: string
}

export const VolunteeringFormPage: FC = () => {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    console.log('Datos enviados:', data)
    alert(t('volunteer.form.thanks'))
  }

  return (
    <>
      <Header />
      <main className="py-20 px-4 md:px-12 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          {t('volunteer.form.title')}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow">
          {/* Nombre */}
          <div>
            <label className="block font-medium mb-1">{t('volunteer.form.name')}</label>
            <input
              {...register('name', { required: t('volunteer.form.errors.required') })}
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-tmbgreen"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">{t('volunteer.form.email')}</label>
            <input
              type="email"
              {...register('email', { required: t('volunteer.form.errors.required') })}
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-tmbgreen"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Posición */}
          <div>
            <label className="block font-medium mb-1">{t('volunteer.form.position')}</label>
            <select
              {...register('position', { required: t('volunteer.form.errors.select') })}
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-tmbgreen"
            >
              <option value="">{t('volunteer.form.selectPlaceholder')}</option>
              <option value="designer">{t('volunteer.positions.designer.title')}</option>
              <option value="comms">{t('volunteer.positions.comms.title')}</option>
              <option value="architect">{t('volunteer.positions.architect.title')}</option>
              <option value="sociologist">{t('volunteer.positions.sociologist.title')}</option>
            </select>
            {errors.position && <p className="text-red-600 text-sm mt-1">{errors.position.message}</p>}
          </div>

          {/* Mensaje adicional */}
          <div>
            <label className="block font-medium mb-1">{t('volunteer.form.message')}</label>
            <textarea
              {...register('message')}
              rows={4}
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-tmbgreen"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 font-semibold rounded transition"
          >
            {t('volunteer.form.submit')}
          </button>
        </form>
      </main>
    </>
  )
}
