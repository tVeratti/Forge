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
            IEnumerable<DefinitionTagModel> tags,
            IEnumerable<DefinitionSettingModel> settings)
        {
            model.Tags = tags.Where(dt => dt.DefinitionId == model.Id);
            model.Settings = settings.Where(ds => ds.DefinitionId == model.Id);
            model.Settings.ToList().ForEach(s =>
            {
                // Get all values for DefinitionSettings
                s.Values = designer.DefinitionSettingsValues
                    .Where(dsv => dsv.DefinitionSettingId == s.Id)
                    .ToDictionary(dsv => dsv.Key, dsv => dsv.Value);
            });

            return model;
        }

        // http://stackoverflow.com/a/18270091
        public static DataTable ToDataTable<T>(this IEnumerable<T> iList)
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
            object[] values = new object[propertyDescriptorCollection.Count];
            foreach (T iListItem in iList)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = propertyDescriptorCollection[i].GetValue(iListItem);
                }
                dataTable.Rows.Add(values);
            }
            return dataTable;
        }
    }
}
