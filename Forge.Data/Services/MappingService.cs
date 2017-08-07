using System;
using System.Collections.Generic;
using System.Linq;

using Forge.Data.Models;
using System.Data;
using System.ComponentModel;

namespace Forge.Data.Services
{
    public static class MappingService
    {
        public static DefinitionModel MapDefinition(
            CoreModel designer,
            DefinitionModel model,
            LookupValues lookupValues)
        {
            model.Keys = lookupValues.DefinitionValues
                .Where(dv => dv.Id == model.Id)
                .ToDictionary(kvp => kvp.Key, kvp => kvp);

            model.Tags = lookupValues.DefinitionTags
                .Where(dt => dt.DefinitionId == model.Id);

            model.Settings = lookupValues.DefinitionSettings
                .Where(ds => ds.DefinitionId == model.Id);

            model.Settings.ToList().ForEach(s =>
            {
                // Get all values for DefinitionSettings
                s.Keys = lookupValues.DefinitionSettingsValues
                    .Where(dsv => dsv.Id == s.Id)
                    .ToDictionary(kvp => kvp.Key, kvp => kvp);
            });

            return model;
        }

        // http://stackoverflow.com/a/18270091
        public static DataTable ToDataTable<T>(this IEnumerable<T> TList)
        {

            DataTable dataTable = new DataTable();
            PropertyDescriptorCollection propertyDescriptorCollection =
                TypeDescriptor.GetProperties(typeof(T));
            for (int i = 0; i < propertyDescriptorCollection.Count; i++)
            {
                PropertyDescriptor propertyDescriptor = propertyDescriptorCollection[i];
                Type type = propertyDescriptor.PropertyType;

                if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                    type = Nullable.GetUnderlyingType(type);


                dataTable.Columns.Add(propertyDescriptor.Name, type);
            }

            if (TList == null) return dataTable;

            object[] values = new object[propertyDescriptorCollection.Count];
            TList.ToList().ForEach(x =>
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = propertyDescriptorCollection[i].GetValue(x);
                }
                dataTable.Rows.Add(values);
            });

            //foreach (T iListItem in TList ?? new T[0])
            //{
            //    for (int i = 0; i < values.Length; i++)
            //    {
            //        values[i] = propertyDescriptorCollection[i].GetValue(iListItem);
            //    }
            //    dataTable.Rows.Add(values);
            //}
            return dataTable;
        }

        //public static IEnumerable<TB> ToTableModel<T, TB>(this IEnumerable<T> iList)
        //{
        //    return iList.Select(x => (TB)x);
        //}
    }
}
